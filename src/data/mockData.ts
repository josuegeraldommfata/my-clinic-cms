export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  card: string;
  muted: string;
  footerBg: string;
  footerText: string;
}

export interface SiteData {
  identity: {
    name: string;
    crm: string;
    specialty: string;
    photo: string;
    logo: string;
  };
  theme: ThemeColors;
  navbar: {
    links: { label: string; href: string }[];
    ctaText: string;
  };
  home: {
    hero: {
      title: string;
      subtitle: string;
      text: string;
      ctaText: string;
    };
    services: {
      title: string;
      items: { icon: string; title: string; description: string }[];
    };
    differentials: {
      title: string;
      items: { icon: string; title: string; description: string }[];
    };
    cta: {
      title: string;
      text: string;
      buttonText: string;
    };
  };
  about: {
    bio: string;
    education: { title: string; institution: string; year: string }[];
    experience: { role: string; place: string; period: string }[];
  };
  schedule: {
    days: string;
    hours: string;
    address: string;
    whatsapp: string;
    phone: string;
  };
  blog: {
    id: string;
    title: string;
    image: string;
    summary: string;
    content: string;
    date: string;
  }[];
  contact: {
    phone: string;
    whatsapp: string;
    email: string;
    address: string;
    mapUrl: string;
    social: { platform: string; url: string }[];
  };
  footer: {
    text: string;
    links: { label: string; href: string }[];
    social: { platform: string; url: string }[];
  };
}

export const defaultSiteData: SiteData = {
  identity: {
    name: "Dr. João Silva",
    crm: "CRM/SP 123456",
    specialty: "Cardiologista",
    photo: "",
    logo: "",
  },
  theme: {
    primary: "#0d9488",
    secondary: "#d97706",
    accent: "#b2dfdb",
    background: "#f5f9f8",
    foreground: "#1e3a3a",
    card: "#ffffff",
    muted: "#e8efee",
    footerBg: "#1e3a3a",
    footerText: "#f5f9f8",
  },
  navbar: {
    links: [
      { label: "Home", href: "/" },
      { label: "Quem Somos", href: "/quem-somos" },
      { label: "Agenda", href: "/agenda" },
      { label: "Conteúdo", href: "/conteudo" },
      { label: "Contato", href: "/contato" },
    ],
    ctaText: "Agendar Consulta",
  },
  home: {
    hero: {
      title: "Dr. João Silva",
      subtitle: "Cardiologista",
      text: "Cuidando da sua saúde com experiência, ética e dedicação. Atendimento humanizado e personalizado para você e sua família.",
      ctaText: "Agendar Consulta",
    },
    services: {
      title: "Nossos Serviços",
      items: [
        { icon: "Heart", title: "Cardiologia", description: "Diagnóstico e tratamento de doenças cardiovasculares com tecnologia de ponta." },
        { icon: "ClipboardCheck", title: "Check-up Preventivo", description: "Avaliação completa para prevenção e detecção precoce de doenças." },
        { icon: "Stethoscope", title: "Avaliação Clínica", description: "Consultas detalhadas com análise criteriosa do seu quadro de saúde." },
        { icon: "UserCheck", title: "Acompanhamento Médico", description: "Monitoramento contínuo para garantir sua qualidade de vida." },
      ],
    },
    differentials: {
      title: "Nossos Diferenciais",
      items: [
        { icon: "HeartHandshake", title: "Atendimento Humanizado", description: "Cada paciente é único e merece atenção especial e cuidado individualizado." },
        { icon: "Award", title: "Experiência Clínica", description: "Mais de 15 anos de experiência em cardiologia e medicina interna." },
        { icon: "Monitor", title: "Tecnologia Moderna", description: "Equipamentos de última geração para diagnósticos precisos." },
        { icon: "Users", title: "Acompanhamento Personalizado", description: "Planos de tratamento adaptados às necessidades de cada paciente." },
      ],
    },
    cta: {
      title: "Cuide da sua saúde hoje",
      text: "Agende sua consulta e dê o primeiro passo para uma vida mais saudável.",
      buttonText: "Agendar Consulta",
    },
  },
  about: {
    bio: "Dr. João Silva é médico cardiologista com mais de 15 anos de experiência. Formado pela Universidade de São Paulo (USP), dedica-se ao cuidado integral do paciente, combinando competência técnica com atendimento humanizado. Sua abordagem prioriza a prevenção e a educação em saúde, buscando sempre os melhores resultados para seus pacientes.",
    education: [
      { title: "Graduação em Medicina", institution: "Universidade de São Paulo (USP)", year: "2005" },
      { title: "Residência em Cardiologia", institution: "InCor - HCFMUSP", year: "2008" },
      { title: "Especialização em Ecocardiografia", institution: "InCor - HCFMUSP", year: "2009" },
      { title: "Fellowship em Cardiologia Intervencionista", institution: "Cleveland Clinic", year: "2011" },
    ],
    experience: [
      { role: "Cardiologista Titular", place: "Hospital Sírio-Libanês", period: "2012 - Atual" },
      { role: "Médico Assistente", place: "InCor - HCFMUSP", period: "2008 - 2012" },
      { role: "Professor de Cardiologia", place: "Faculdade de Medicina USP", period: "2015 - Atual" },
    ],
  },
  schedule: {
    days: "Segunda a Sexta-feira",
    hours: "08:00 às 18:00",
    address: "Av. Paulista, 1000 - Sala 501, Bela Vista, São Paulo - SP, 01310-100",
    whatsapp: "5511999999999",
    phone: "(11) 3000-0000",
  },
  blog: [
    {
      id: "1",
      title: "A importância do check-up cardiológico anual",
      image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600",
      summary: "Entenda por que realizar exames preventivos regularmente pode salvar sua vida.",
      content: "O check-up cardiológico anual é fundamental para a detecção precoce de doenças cardiovasculares. Durante a consulta, o médico avalia fatores de risco como hipertensão, colesterol elevado, diabetes e histórico familiar.\n\nExames como eletrocardiograma, ecocardiograma e teste ergométrico permitem identificar alterações antes que se tornem problemas graves. A prevenção é sempre o melhor caminho para uma vida saudável.\n\nRecomenda-se que homens a partir dos 40 anos e mulheres a partir dos 50 realizem check-ups anuais, ou antes caso apresentem fatores de risco.",
      date: "2024-03-15",
    },
    {
      id: "2",
      title: "Hipertensão: o inimigo silencioso",
      image: "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=600",
      summary: "Conheça os riscos da pressão alta e como manter seus níveis controlados.",
      content: "A hipertensão arterial afeta cerca de 30% da população brasileira e é considerada um dos principais fatores de risco para doenças cardiovasculares.\n\nConhecida como 'inimigo silencioso', a pressão alta geralmente não apresenta sintomas, mas pode causar danos graves ao coração, cérebro e rins.\n\nO controle da hipertensão envolve mudanças no estilo de vida, como alimentação saudável, exercícios físicos regulares, controle do estresse e, quando necessário, uso de medicamentos prescritos pelo cardiologista.",
      date: "2024-02-20",
    },
    {
      id: "3",
      title: "Exercícios físicos e saúde do coração",
      image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600",
      summary: "Descubra como a atividade física regular beneficia seu sistema cardiovascular.",
      content: "A prática regular de exercícios físicos é uma das melhores formas de proteger o coração. Atividades aeróbicas como caminhada, corrida e natação fortalecem o músculo cardíaco e melhoram a circulação.\n\nRecomenda-se pelo menos 150 minutos de atividade física moderada por semana. Antes de iniciar qualquer programa de exercícios, é fundamental realizar uma avaliação cardiológica.\n\nOs benefícios incluem redução da pressão arterial, controle do colesterol, melhora da capacidade pulmonar e redução do estresse.",
      date: "2024-01-10",
    },
  ],
  contact: {
    phone: "(11) 3000-0000",
    whatsapp: "5511999999999",
    email: "contato@drjoaosilva.com.br",
    address: "Av. Paulista, 1000 - Sala 501, Bela Vista, São Paulo - SP, 01310-100",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.1975!2d-46.6544!3d-23.5632!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDMzJzQ3LjUiUyA0NsKwMzknMTUuOCJX!5e0!3m2!1spt-BR!2sbr!4v1234567890",
    social: [
      { platform: "Instagram", url: "https://instagram.com/drjoaosilva" },
      { platform: "Facebook", url: "https://facebook.com/drjoaosilva" },
      { platform: "LinkedIn", url: "https://linkedin.com/in/drjoaosilva" },
    ],
  },
  footer: {
    text: "© 2024 Dr. João Silva - Cardiologista. Todos os direitos reservados.",
    links: [
      { label: "Home", href: "/" },
      { label: "Quem Somos", href: "/quem-somos" },
      { label: "Agenda", href: "/agenda" },
      { label: "Conteúdo", href: "/conteudo" },
      { label: "Contato", href: "/contato" },
    ],
    social: [
      { platform: "Instagram", url: "https://instagram.com/drjoaosilva" },
      { platform: "Facebook", url: "https://facebook.com/drjoaosilva" },
      { platform: "LinkedIn", url: "https://linkedin.com/in/drjoaosilva" },
    ],
  },
};
