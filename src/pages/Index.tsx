import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Icon from '@/components/ui/icon';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const Index = () => {
  const { toast } = useToast();
  const [selectedAmount, setSelectedAmount] = useState<number>(500);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [gameLogin, setGameLogin] = useState('');
  const [gameUserId, setGameUserId] = useState('');
  const [selectedGame, setSelectedGame] = useState('steam');

  const games = [
    { id: 'steam', name: 'Steam', icon: 'Gamepad2', loginLabel: 'Логин Steam', userIdLabel: null },
    { id: 'roblox', name: 'Roblox', icon: 'Boxes', loginLabel: 'Username Roblox', userIdLabel: 'User ID' },
    { id: 'pubg', name: 'PUBG Mobile', icon: 'Target', loginLabel: 'Player ID', userIdLabel: null },
    { id: 'mlbb', name: 'Mobile Legends', icon: 'Swords', loginLabel: 'User ID', userIdLabel: 'Zone ID' },
    { id: 'freefire', name: 'Free Fire', icon: 'Flame', loginLabel: 'Player ID', userIdLabel: null },
  ];

  const popularAmounts = [100, 300, 500, 1000, 2000, 5000];

  const tariffs = [
    { 
      id: 1, 
      name: 'Базовый', 
      amount: 500, 
      bonus: 0, 
      icon: 'Rocket',
      popular: false 
    },
    { 
      id: 2, 
      name: 'Популярный', 
      amount: 1000, 
      bonus: 50, 
      icon: 'Zap',
      popular: true 
    },
    { 
      id: 3, 
      name: 'Премиум', 
      amount: 3000, 
      bonus: 200, 
      icon: 'Crown',
      popular: false 
    },
    { 
      id: 4, 
      name: 'Максимум', 
      amount: 5000, 
      bonus: 500, 
      icon: 'Trophy',
      popular: false 
    },
  ];

  const reviews = [
    {
      id: 1,
      name: 'Александр М.',
      avatar: 'AM',
      rating: 5,
      text: 'Пополнял уже 5 раз, всё моментально приходит. Отличный сервис!',
      date: '2 дня назад'
    },
    {
      id: 2,
      name: 'Мария К.',
      avatar: 'МК',
      rating: 5,
      text: 'Быстро, удобно и безопасно. Рекомендую всем!',
      date: '5 дней назад'
    },
    {
      id: 3,
      name: 'Дмитрий П.',
      avatar: 'ДП',
      rating: 4,
      text: 'Хорошие бонусы на больших суммах. Буду пользоваться ещё.',
      date: 'неделю назад'
    },
  ];

  const faqs = [
    {
      question: 'Как быстро поступают средства?',
      answer: 'Средства поступают на игровой баланс моментально после подтверждения оплаты. В среднем это занимает от 30 секунд до 5 минут.'
    },
    {
      question: 'Какие игры поддерживаются?',
      answer: 'Мы поддерживаем пополнение баланса в Steam, покупку Robux в Roblox, UC в PUBG Mobile, Diamond в Mobile Legends Bang Bang и Diamond в Free Fire.'
    },
    {
      question: 'Какие способы оплаты доступны?',
      answer: 'Мы принимаем банковские карты Visa, Mastercard, МИР, а также электронные кошельки и СБП.'
    },
    {
      question: 'Безопасно ли пополнять баланс через ваш сервис?',
      answer: 'Да, абсолютно безопасно. Мы используем защищенное соединение SSL и не храним данные ваших карт. Все платежи проходят через проверенные платежные системы.'
    },
    {
      question: 'Что делать, если средства не пришли?',
      answer: 'Если средства не поступили в течение 15 минут, обратитесь в нашу службу поддержки через форму обратной связи или напишите на support@steamtopup.ru'
    },
    {
      question: 'Есть ли комиссия при пополнении?',
      answer: 'Нет, мы не взимаем дополнительных комиссий. Вы платите ровно ту сумму, которую хотите зачислить на баланс (плюс бонусы на некоторых тарифах).'
    },
  ];

  const handleTopUp = async () => {
    const amount = customAmount ? parseInt(customAmount) : selectedAmount;
    
    if (!email || !name || !gameLogin) {
      toast({
        title: 'Заполните все поля',
        description: 'Пожалуйста, укажите email, имя и игровой логин',
        variant: 'destructive'
      });
      return;
    }
    
    const currentGame = games.find(g => g.id === selectedGame);
    if (currentGame?.userIdLabel && !gameUserId) {
      toast({
        title: 'Заполните все поля',
        description: `Пожалуйста, укажите ${currentGame.userIdLabel}`,
        variant: 'destructive'
      });
      return;
    }
    
    if (amount < 100) {
      toast({
        title: 'Минимальная сумма',
        description: 'Минимальная сумма пополнения - 100₽',
        variant: 'destructive'
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const response = await fetch('https://functions.poehali.dev/854d4aad-37fb-4211-97ee-94c6bc04c8f6', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          name,
          gameLogin,
          gameUserId,
          gameType: selectedGame,
          amount
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: '✅ Успешно!',
          description: data.message,
          duration: 5000
        });
        
        setEmail('');
        setName('');
        setGameLogin('');
        setGameUserId('');
        setCustomAmount('');
        setSelectedAmount(500);
      } else {
        toast({
          title: 'Ошибка',
          description: 'Не удалось обработать запрос. Попробуйте снова.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка сети',
        description: 'Проверьте подключение к интернету',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#171a21] via-[#1b2838] to-[#171a21]">
      <header className="border-b border-[#66c0f4]/20 bg-[#1b2838]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#66c0f4] to-[#8bc53f] rounded-lg flex items-center justify-center">
                <Icon name="Gamepad2" className="text-[#171a21]" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">BB.sell</h1>
                <p className="text-xs text-[#66c0f4]">Быстрое пополнение баланса</p>
              </div>
            </div>
            <nav className="hidden md:flex gap-6">
              <a href="#topup" className="text-gray-300 hover:text-[#66c0f4] transition-colors">Пополнить</a>
              <a href="#tariffs" className="text-gray-300 hover:text-[#66c0f4] transition-colors">Тарифы</a>
              <a href="#reviews" className="text-gray-300 hover:text-[#66c0f4] transition-colors">Отзывы</a>
              <a href="#support" className="text-gray-300 hover:text-[#66c0f4] transition-colors">Поддержка</a>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <section id="topup" className="mb-20">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-5xl font-bold text-white mb-4">
              Пополни игровой баланс 🎮
            </h2>
            <p className="text-xl text-gray-400">
              Steam • Roblox • PUBG Mobile • Mobile Legends • Free Fire
            </p>
            <p className="text-lg text-gray-500 mt-2">
              Моментальное зачисление • Безопасные платежи • Бонусы к пополнению
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card className="bg-[#1b2838] border-[#66c0f4]/30 transition-transform duration-300 hover:scale-105">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Icon name="Wallet" className="text-[#66c0f4]" />
                  Быстрое пополнение
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Выберите сумму и способ оплаты
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-white mb-3 block">Выберите игру *</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {games.map((game) => (
                      <Button
                        key={game.id}
                        variant={selectedGame === game.id ? 'default' : 'outline'}
                        className={`flex items-center gap-2 ${selectedGame === game.id
                            ? 'bg-gradient-to-r from-[#66c0f4] to-[#8bc53f] text-[#171a21] border-0'
                            : 'bg-[#2a475e] border-[#66c0f4]/30 text-white hover:bg-[#66c0f4]/20'
                        }`}
                        onClick={() => {
                          setSelectedGame(game.id);
                          setGameLogin('');
                          setGameUserId('');
                        }}
                      >
                        <Icon name={game.icon as any} size={16} />
                        {game.name}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-white mb-2 block">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-[#2a475e] border-[#66c0f4]/30 text-white placeholder:text-gray-500"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="name" className="text-white mb-2 block">Имя *</Label>
                  <Input
                    id="name"
                    placeholder="Ваше имя"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-[#2a475e] border-[#66c0f4]/30 text-white placeholder:text-gray-500"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="gameLogin" className="text-white mb-2 block">
                    {games.find(g => g.id === selectedGame)?.loginLabel} *
                  </Label>
                  <Input
                    id="gameLogin"
                    placeholder={`Введите ${games.find(g => g.id === selectedGame)?.loginLabel}`}
                    value={gameLogin}
                    onChange={(e) => setGameLogin(e.target.value)}
                    className="bg-[#2a475e] border-[#66c0f4]/30 text-white placeholder:text-gray-500"
                    required
                  />
                </div>
                
                {games.find(g => g.id === selectedGame)?.userIdLabel && (
                  <div>
                    <Label htmlFor="gameUserId" className="text-white mb-2 block">
                      {games.find(g => g.id === selectedGame)?.userIdLabel} *
                    </Label>
                    <Input
                      id="gameUserId"
                      placeholder={`Введите ${games.find(g => g.id === selectedGame)?.userIdLabel}`}
                      value={gameUserId}
                      onChange={(e) => setGameUserId(e.target.value)}
                      className="bg-[#2a475e] border-[#66c0f4]/30 text-white placeholder:text-gray-500"
                      required
                    />
                  </div>
                )}
                
                <div>
                  <Label className="text-white mb-3 block">Популярные суммы</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {popularAmounts.map((amount) => (
                      <Button
                        key={amount}
                        variant={selectedAmount === amount ? 'default' : 'outline'}
                        className={`${
                          selectedAmount === amount
                            ? 'bg-gradient-to-r from-[#66c0f4] to-[#8bc53f] text-[#171a21] border-0'
                            : 'bg-[#2a475e] border-[#66c0f4]/30 text-white hover:bg-[#66c0f4]/20'
                        }`}
                        onClick={() => {
                          setSelectedAmount(amount);
                          setCustomAmount('');
                        }}
                      >
                        {amount}₽
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="custom-amount" className="text-white mb-2 block">
                    Или введите свою сумму
                  </Label>
                  <Input
                    id="custom-amount"
                    type="number"
                    placeholder="Введите сумму..."
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedAmount(0);
                    }}
                    className="bg-[#2a475e] border-[#66c0f4]/30 text-white placeholder:text-gray-500"
                  />
                </div>

                <div className="bg-[#2a475e] rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">К оплате:</span>
                    <span className="text-2xl font-bold text-[#8bc53f]">
                      {customAmount || selectedAmount}₽
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Icon name="Shield" size={16} className="text-[#8bc53f]" />
                    Защищенная транзакция
                  </div>
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-[#66c0f4] to-[#8bc53f] text-[#171a21] font-bold text-lg py-6 hover:opacity-90 transition-opacity disabled:opacity-50"
                  onClick={handleTopUp}
                  disabled={isProcessing}
                >
                  <Icon name={isProcessing ? 'Loader2' : 'CreditCard'} className={`mr-2 ${isProcessing ? 'animate-spin' : ''}`} />
                  {isProcessing ? 'Обработка...' : 'Пополнить баланс'}
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-[#66c0f4]/10 to-[#8bc53f]/10 border-[#66c0f4]/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Icon name="Sparkles" className="text-[#8bc53f]" />
                    Преимущества сервиса
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { icon: 'Zap', title: 'Мгновенно', desc: 'Средства зачисляются за 30 секунд' },
                    { icon: 'Lock', title: 'Безопасно', desc: 'SSL-шифрование и защита данных' },
                    { icon: 'Gift', title: 'Бонусы', desc: 'До 10% к сумме пополнения' },
                    { icon: 'Headphones', title: 'Поддержка 24/7', desc: 'Всегда готовы помочь' },
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3 animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                      <div className="w-10 h-10 rounded-lg bg-[#66c0f4]/20 flex items-center justify-center flex-shrink-0">
                        <Icon name={feature.icon as any} className="text-[#66c0f4]" size={20} />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">{feature.title}</h4>
                        <p className="text-gray-400 text-sm">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-[#1b2838] border-[#8bc53f]/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Icon name="TrendingUp" className="text-[#8bc53f]" />
                    Статистика сервиса
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Пользователей', value: '50,000+' },
                      { label: 'Транзакций', value: '200,000+' },
                      { label: 'Средний рейтинг', value: '4.9/5' },
                      { label: 'Время работы', value: '3 года' },
                    ].map((stat, idx) => (
                      <div key={idx} className="text-center p-3 bg-[#2a475e] rounded-lg">
                        <div className="text-2xl font-bold text-[#8bc53f]">{stat.value}</div>
                        <div className="text-sm text-gray-400">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="tariffs" className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Тарифы и цены</h2>
            <p className="text-gray-400">Выгодные предложения с бонусами</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {tariffs.map((tariff, idx) => (
              <Card
                key={tariff.id}
                className={`relative transition-transform duration-300 hover:scale-105 ${
                  tariff.popular
                    ? 'bg-gradient-to-br from-[#66c0f4]/20 to-[#8bc53f]/20 border-[#8bc53f]'
                    : 'bg-[#1b2838] border-[#66c0f4]/30'
                }`}
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                {tariff.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#66c0f4] to-[#8bc53f] text-[#171a21]">
                    Популярный
                  </Badge>
                )}
                <CardHeader>
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#66c0f4] to-[#8bc53f] rounded-full flex items-center justify-center">
                    <Icon name={tariff.icon as any} className="text-[#171a21]" size={32} />
                  </div>
                  <CardTitle className="text-white text-center text-2xl">{tariff.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div>
                    <div className="text-4xl font-bold text-[#66c0f4]">{tariff.amount}₽</div>
                    {tariff.bonus > 0 && (
                      <div className="text-[#8bc53f] font-semibold mt-2">
                        + {tariff.bonus}₽ бонус
                      </div>
                    )}
                  </div>
                  <Button
                    className={`w-full ${
                      tariff.popular
                        ? 'bg-gradient-to-r from-[#66c0f4] to-[#8bc53f] text-[#171a21]'
                        : 'bg-[#2a475e] text-white hover:bg-[#66c0f4]/20'
                    }`}
                    onClick={() => {
                      setSelectedAmount(tariff.amount);
                      setCustomAmount('');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    Выбрать
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="reviews" className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Отзывы клиентов</h2>
            <p className="text-gray-400">Что говорят наши пользователи</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {reviews.map((review, idx) => (
              <Card
                key={review.id}
                className="bg-[#1b2838] border-[#66c0f4]/30 transition-transform duration-300 hover:scale-105 animate-fade-in"
                style={{ animationDelay: `${idx * 0.15}s` }}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-gradient-to-br from-[#66c0f4] to-[#8bc53f] text-[#171a21] font-bold">
                        {review.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-white text-base">{review.name}</CardTitle>
                      <div className="flex items-center gap-1 mt-1">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Icon key={i} name="Star" className="text-[#8bc53f] fill-[#8bc53f]" size={14} />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-3">{review.text}</p>
                  <p className="text-sm text-gray-500">{review.date}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="support" className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Поддержка</h2>
            <p className="text-gray-400">Ответы на частые вопросы</p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Tabs defaultValue="faq" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-[#1b2838] mb-8">
                <TabsTrigger value="faq" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#66c0f4] data-[state=active]:to-[#8bc53f] data-[state=active]:text-[#171a21]">
                  <Icon name="HelpCircle" className="mr-2" size={18} />
                  FAQ
                </TabsTrigger>
                <TabsTrigger value="contact" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#66c0f4] data-[state=active]:to-[#8bc53f] data-[state=active]:text-[#171a21]">
                  <Icon name="Mail" className="mr-2" size={18} />
                  Обратная связь
                </TabsTrigger>
              </TabsList>

              <TabsContent value="faq">
                <Card className="bg-[#1b2838] border-[#66c0f4]/30">
                  <CardContent className="pt-6">
                    <Accordion type="single" collapsible className="w-full">
                      {faqs.map((faq, idx) => (
                        <AccordionItem key={idx} value={`item-${idx}`} className="border-[#66c0f4]/20">
                          <AccordionTrigger className="text-white hover:text-[#66c0f4] text-left">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-gray-400">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="contact">
                <Card className="bg-[#1b2838] border-[#66c0f4]/30">
                  <CardHeader>
                    <CardTitle className="text-white">Напишите нам</CardTitle>
                    <CardDescription className="text-gray-400">
                      Мы ответим в течение 24 часов
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-white">Имя</Label>
                      <Input
                        id="name"
                        placeholder="Ваше имя"
                        className="bg-[#2a475e] border-[#66c0f4]/30 text-white placeholder:text-gray-500 mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-white">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        className="bg-[#2a475e] border-[#66c0f4]/30 text-white placeholder:text-gray-500 mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="message" className="text-white">Сообщение</Label>
                      <Input
                        id="message"
                        placeholder="Опишите вашу проблему..."
                        className="bg-[#2a475e] border-[#66c0f4]/30 text-white placeholder:text-gray-500 mt-2 min-h-[100px]"
                      />
                    </div>
                    <Button className="w-full bg-gradient-to-r from-[#66c0f4] to-[#8bc53f] text-[#171a21] font-bold hover:opacity-90">
                      <Icon name="Send" className="mr-2" />
                      Отправить сообщение
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>

      <footer className="bg-[#1b2838] border-t border-[#66c0f4]/20 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#66c0f4] to-[#8bc53f] rounded-lg flex items-center justify-center">
                <Icon name="Gamepad2" className="text-[#171a21]" size={24} />
              </div>
              <div>
                <div className="text-white font-bold">BB.sell</div>
                <div className="text-sm text-gray-400">© 2024 Все права защищены</div>
              </div>
            </div>
            <div className="flex gap-6 text-gray-400 text-sm">
              <a href="#" className="hover:text-[#66c0f4] transition-colors">Пользовательское соглашение</a>
              <a href="#" className="hover:text-[#66c0f4] transition-colors">Политика конфиденциальности</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;