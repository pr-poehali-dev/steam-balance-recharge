import json
import os
from datetime import datetime
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Process game currency top-up orders (Steam, Roblox, PUBG Mobile, Mobile Legends, Free Fire)
    Args: event - dict with httpMethod, body, queryStringParameters
          context - object with attributes: request_id, function_name
    Returns: HTTP response dict with order status
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    database_url = os.environ.get('DATABASE_URL')
    
    if not database_url:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Database configuration missing'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(database_url)
    
    try:
        if method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            user_email = body_data.get('email', '')
            user_name = body_data.get('name', '')
            game_login = body_data.get('gameLogin', '')
            game_user_id = body_data.get('gameUserId', '')
            game_type = body_data.get('gameType', 'steam')
            amount = int(body_data.get('amount', 0))
            
            bonus = 0
            if amount >= 5000:
                bonus = 500
            elif amount >= 3000:
                bonus = 200
            elif amount >= 1000:
                bonus = 50
            
            total_amount = amount + bonus
            
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(
                    '''INSERT INTO orders 
                       (user_email, user_name, game_login, game_user_id, game_type, amount, bonus, total_amount, status, payment_method)
                       VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                       RETURNING id, created_at''',
                    (user_email, user_name, game_login, game_user_id, game_type, amount, bonus, total_amount, 'processing', 'card')
                )
                result = cur.fetchone()
                conn.commit()
                
                order_id = result['id']
                created_at = result['created_at'].isoformat()
                
                cur.execute(
                    '''UPDATE orders 
                       SET status = %s, completed_at = %s, updated_at = %s 
                       WHERE id = %s''',
                    ('completed', datetime.now(), datetime.now(), order_id)
                )
                conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': True,
                    'orderId': order_id,
                    'gameType': game_type,
                    'amount': amount,
                    'bonus': bonus,
                    'totalAmount': total_amount,
                    'status': 'completed',
                    'message': f'Баланс успешно пополнен на {total_amount}₽',
                    'createdAt': created_at
                }),
                'isBase64Encoded': False
            }
        
        elif method == 'GET':
            email = event.get('queryStringParameters', {}).get('email', '')
            
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                if email:
                    cur.execute(
                        '''SELECT id, user_email, user_name, game_login, game_user_id, game_type, amount, bonus, 
                           total_amount, status, created_at, completed_at
                           FROM orders WHERE user_email = %s ORDER BY created_at DESC LIMIT 10''',
                        (email,)
                    )
                else:
                    cur.execute(
                        '''SELECT id, user_email, user_name, game_login, game_user_id, game_type, amount, bonus, 
                           total_amount, status, created_at, completed_at
                           FROM orders ORDER BY created_at DESC LIMIT 50'''
                    )
                
                orders = cur.fetchall()
                
                for order in orders:
                    if order['created_at']:
                        order['created_at'] = order['created_at'].isoformat()
                    if order['completed_at']:
                        order['completed_at'] = order['completed_at'].isoformat()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'orders': orders}),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    finally:
        conn.close()