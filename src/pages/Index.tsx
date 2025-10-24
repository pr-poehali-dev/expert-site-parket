import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

export default function Index() {
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      const response = await fetch('https://functions.poehali.dev/882cf3b5-bcb8-495e-8f89-9213d707d882', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', phone: '', email: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? 'bg-background/95 backdrop-blur-sm shadow-md' : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary">Юрий Ульянов</h1>
            <div className="hidden md:flex gap-8">
              {['home', 'services', 'about', 'contacts'].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`text-sm uppercase tracking-wider transition-colors hover:text-primary ${
                    activeSection === section ? 'text-primary font-semibold' : 'text-foreground'
                  }`}
                >
                  {section === 'home' && 'Главная'}
                  {section === 'services' && 'Услуги'}
                  {section === 'about' && 'Обо мне'}
                  {section === 'contacts' && 'Контакты'}
                </button>
              ))}
            </div>
            <Button variant="outline" className="md:hidden">
              <Icon name="Menu" size={24} />
            </Button>
          </div>
        </div>
      </nav>

      <section
        id="home"
        className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20"
        style={{
          backgroundImage:
            'url(https://cdn.poehali.dev/projects/e98e68e4-5781-4e29-97fa-eb006529b073/files/79ba5c98-e92b-4178-b616-48b506eec831.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
        <div className="container mx-auto px-6 relative z-10 text-center animate-fade-in">
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Элитный Паркет
          </h2>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
            Эксперт по отделке помещений и укладке премиального паркета с 15-летним опытом
          </p>
          <Button
            size="lg"
            onClick={() => scrollToSection('contacts')}
            className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg"
          >
            Получить консультацию
          </Button>
        </div>
      </section>

      <section id="services" className="py-24 bg-accent">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 animate-fade-in">
            Услуги
          </h2>
          <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
            Предоставляю полный спектр работ по отделке помещений премиум-класса
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: 'Layers',
                title: 'Укладка элитного паркета',
                description:
                  'Профессиональная укладка паркета любой сложности: елочка, французская елка, шашка, художественный паркет',
              },
              {
                icon: 'Paintbrush',
                title: 'Отделка помещений',
                description:
                  'Комплексная отделка: декоративная штукатурка, молдинги, лепнина, покраска стен и потолков',
              },
              {
                icon: 'Sparkles',
                title: 'Реставрация паркета',
                description:
                  'Восстановление старого паркета: циклевка, шлифовка, тонирование, покрытие лаком или маслом',
              },
              {
                icon: 'Shield',
                title: 'Защитное покрытие',
                description:
                  'Нанесение премиальных масел и лаков для долговечности и красоты паркета',
              },
              {
                icon: 'Ruler',
                title: 'Дизайн-проект',
                description:
                  'Разработка индивидуальных решений и схем укладки с учетом интерьера',
              },
              {
                icon: 'CheckCircle',
                title: 'Гарантия качества',
                description:
                  'Предоставляю гарантию на все виды работ до 3 лет, использую только премиальные материалы',
              },
            ].map((service, index) => (
              <Card
                key={index}
                className="p-8 hover:shadow-xl transition-shadow duration-300 bg-card animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="mb-4">
                  <Icon name={service.icon} size={48} className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-muted-foreground">{service.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-16">Портфолио работ</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              'https://cdn.poehali.dev/projects/e98e68e4-5781-4e29-97fa-eb006529b073/files/8acccd57-17f9-4702-8e89-2f6bc0e23ffb.jpg',
              'https://cdn.poehali.dev/projects/e98e68e4-5781-4e29-97fa-eb006529b073/files/9f6aa220-58e8-489d-a178-8b94a4b03f5f.jpg',
              'https://cdn.poehali.dev/projects/e98e68e4-5781-4e29-97fa-eb006529b073/files/79ba5c98-e92b-4178-b616-48b506eec831.jpg',
            ].map((img, index) => (
              <div
                key={index}
                className="relative overflow-hidden rounded-lg group cursor-pointer animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <img
                  src={img}
                  alt={`Проект ${index + 1}`}
                  className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <p className="text-white font-semibold">Премиальный проект</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="py-24 bg-accent">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 animate-fade-in">
              Обо мне
            </h2>
            <Card className="p-8 md:p-12">
              <div className="space-y-6 text-lg leading-relaxed">
                <p>
                  Здравствуйте! Меня зовут <span className="font-semibold text-primary">Юрий Ульянов</span>, 
                  и я занимаюсь укладкой элитного паркета и отделкой помещений уже более 15 лет.
                </p>
                <p>
                  Моя специализация — работа с премиальными материалами и создание эксклюзивных интерьеров.
                  Каждый проект для меня — это возможность воплотить уникальное видение клиента с максимальным
                  вниманием к деталям.
                </p>
                <div className="bg-primary/10 p-6 rounded-lg my-8">
                  <h3 className="text-2xl font-semibold mb-4">Почему выбирают меня:</h3>
                  <ul className="space-y-3">
                    {[
                      '15+ лет опыта работы с элитным паркетом',
                      'Более 200 реализованных проектов',
                      'Работа только с премиальными материалами',
                      'Индивидуальный подход к каждому клиенту',
                      'Гарантия качества до 3 лет',
                      'Соблюдение сроков и чистота на объекте',
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Icon name="CheckCircle" size={24} className="text-primary flex-shrink-0 mt-1" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <p>
                  Я постоянно совершенствую свои навыки, слежу за новыми технологиями и трендами в отделке.
                  Для меня важно не просто выполнить работу, а создать пространство, которое будет радовать
                  вас долгие годы.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section id="contacts" className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 animate-fade-in">
              Контакты
            </h2>
            <p className="text-center text-muted-foreground mb-12">
              Свяжитесь со мной для консультации и расчета стоимости
            </p>
            <Card className="p-8 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Ваше имя</label>
                  <Input 
                    placeholder="Иван Иванов" 
                    className="w-full"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Телефон</label>
                  <Input 
                    placeholder="+7 (___) ___-__-__" 
                    className="w-full"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input 
                    type="email" 
                    placeholder="email@example.com" 
                    className="w-full"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Опишите ваш проект</label>
                  <Textarea
                    placeholder="Расскажите о том, какие работы вас интересуют..."
                    className="w-full min-h-32"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    required
                  />
                </div>
                {submitStatus === 'success' && (
                  <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded">
                    ✓ Заявка успешно отправлена! Свяжемся с вами в ближайшее время.
                  </div>
                )}
                {submitStatus === 'error' && (
                  <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
                    ✗ Ошибка отправки. Попробуйте позже или свяжитесь по телефону.
                  </div>
                )}
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-lg disabled:opacity-50"
                >
                  {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
                </Button>
              </form>
              <div className="mt-12 pt-8 border-t space-y-4">
                <div className="flex items-center gap-3 text-lg">
                  <Icon name="Phone" size={24} className="text-primary" />
                  <a href="tel:+79001234567" className="hover:text-primary transition-colors">
                    +7 (900) 123-45-67
                  </a>
                </div>
                <div className="flex items-center gap-3 text-lg">
                  <Icon name="Mail" size={24} className="text-primary" />
                  <a href="mailto:info@ulyanov-parket.ru" className="hover:text-primary transition-colors">
                    info@ulyanov-parket.ru
                  </a>
                </div>
                <div className="flex items-center gap-3 text-lg">
                  <Icon name="MapPin" size={24} className="text-primary" />
                  <span>Москва, работаю по всей России</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <footer className="bg-foreground text-background py-12">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-2xl font-bold mb-4">Юрий Ульянов</h3>
          <p className="text-background/80 mb-6">Эксперт по элитному паркету и отделке помещений</p>
          <div className="flex justify-center gap-6">
            {['Instagram', 'Facebook', 'MessageCircle'].map((social) => (
              <button
                key={social}
                className="hover:text-primary transition-colors"
                aria-label={social}
              >
                <Icon name={social} size={24} />
              </button>
            ))}
          </div>
          <p className="text-background/60 text-sm mt-8">
            © 2024 Юрий Ульянов. Все права защищены.
          </p>
        </div>
      </footer>
    </div>
  );
}