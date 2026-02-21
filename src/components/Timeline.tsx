import { motion } from 'framer-motion';
import { TimelineItem } from './sections/TimelineItem';
import { assetUrl } from '@/lib/utils';

const milestones = [
  {
    year: '2004',
    title: 'O começo de tudo',
    description: 'Chegou ao mundo pronta pra conquistar tudo (ou pelo menos tentar)',
    image: assetUrl('/timeline/nasceu.png'),
  },
  {
    year: '',
    title: 'Começou a tentar andar',
    description: 'Os primeiros passos... e tombos. Muitos tombos.',
    image: assetUrl('/timeline/andar.png'),
  },
  {
    year: '',
    title: 'Descobriu que tinha a melhor mãe do mundo',
    description: 'Que faz de tudo por ela desde o início',
    image: assetUrl('/timeline/mae.png'),
  },
  {
    year: '',
    title: 'Desde sempre amando os animais',
    description: 'O amor por bichinhos veio antes de aprender a falar direito',
    image: assetUrl('/timeline/animais.png'),
  },
  {
    year: '',
    title: 'Tentou a carreira de modelo juvenil que não decolou',
    description: 'Pelo menos as fotos ficaram fofas pra memória',
    image: assetUrl('/timeline/modelo.png'),
  },
  {
    year: '',
    title: 'Aproveitou e amou muito a vida até agora',
    description: 'Com pessoas incríveis, que trouxeram muito amor em cada momento.',
    image: assetUrl('/timeline/pessoas.png'),
  },
  {
    year: '',
    title: 'Decidiu o que queria da vida',
    description: 'e não se arrependeu nem um pouco dessa escolha',
    image: assetUrl('/timeline/curso.png'),
  },
  {
    year: '',
    title: 'Conheceu pessoas incríveis',
    description: 'que viraram rotina e vão tornar a vida mais especial sempre',
    image: assetUrl('/timeline/novos_amigos.png'),
  },
  {
    year: '',
    title: 'Conheceu o amor',
    description: 'que transformou os dias comuns nos mais especiais',
    image: assetUrl('/timeline/amor.png'),
  },

  {
    year: '2026',
    title: 'E finalmente tá se formando em Ciência da Computação e completando 22 anos!',
    description: 'Agora é continuar crescendo e amando a vida cada vez mais!',
    image: assetUrl('/timeline/2026.png'),
  },
];

export default function Timeline() {
  return (
    <section className="py-20 px-4 sm:px-8 max-w-4xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-3xl sm:text-4xl font-bold text-center mb-16 font-timeline bg-clip-text text-transparent"
        style={{ backgroundImage: 'linear-gradient(to right, #CB8CC2, #3794CF, #077BC6)' }}
      >
        Vida de Lu
      </motion.h2>

      <div className="relative">
        {/* Linha fina no centro: no celular também, conectando os itens conforme entram */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px sm:w-px bg-gradient-to-b from-[#CB8CC2]/50 via-[#7BB1D9]/30 to-transparent -translate-x-1/2" />
        {milestones.map((item, i) => (
          <TimelineItem key={`${item.title}-${i}`} item={item} index={i} />
        ))}
      </div>
    </section>
  );
}
