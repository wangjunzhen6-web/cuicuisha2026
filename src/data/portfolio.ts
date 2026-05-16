import { Project, WorkExperience } from '../types';

/**
 * Project Data
 * Tip: For local images, place them in the /public folder and use absolute paths
 * e.g., imageUrl: "/my-project-shot.png"
 */
export const projects: Project[] = [
  {
    id: '1',
    title: '氢弹大促 (新年大促) *',
    subtitle: "NEW YEAR'S PROMOTION",
    description: '借助假期出行热度，转换为迎接用户旅行拍照需求，针对拍照类手机推出了丰厚的优惠券。旨在提升GMV规模，助力手机达成订单目标。',
    imageUrl: 'https://images.unsplash.com/photo-1616469850117-9003504f7626?auto=format&fit=crop&q=80&w=1200',
    category: 'landing',
    tags: ['大促设计', '视觉落地', '新年'],
    designBy: '王军震',
    themeColor: '#ff2d2d',
    strategy: [
      '使用出行工具为背景氛围，增强页面的旅游出行感受',
      '颜色采用符合季节的主色调',
      '利用AI生成摄影类素材图来解决没有对应素材图的痛点'
    ],
    secondaryImages: [
      'https://images.unsplash.com/photo-1616469850117-9003504f7626?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600'
    ]
  },
  {
    id: '2',
    title: '摄影出游季 (秋季) *',
    subtitle: 'PHOTO SERIES MOBILE PHONE TRAVEL SEASON PROMOTION',
    description: '旗舰摄影手机促销页面。采用金秋色调，营造温馨而富有质感的视觉体验。',
    imageUrl: 'https://images.unsplash.com/photo-1507090960745-b32f65d3113a?auto=format&fit=crop&q=80&w=1200',
    category: 'landing',
    tags: ['秋季', '摄影', '旗舰机'],
    designBy: '王军震',
    themeColor: '#FF572B',
    strategy: [
      '暖色调处理增强秋意感',
      '拟物化场景嵌入手机展示',
      '强调摄影成片效果展示'
    ]
  },
  {
    id: '3',
    title: '摄影出游季 (冬季) *',
    subtitle: 'WINTER VERSION PROMOTION',
    description: '冬日寻趣，每帧如电影。旗舰机型影像大片氛围落地。',
    imageUrl: '/src/assets/images/regenerated_image_1778920662066.png',
    category: 'landing',
    tags: ['冬季', '纯净', '氛围感'],
    designBy: '王军震',
    themeColor: '#5EC3FF',
    strategy: [
      '冷色调背景衬托产品质感',
      '雪景元素增加季节代入感',
      '电影感排版引导视觉路径'
    ]
  },
  {
    id: '4',
    title: '3D素材库搭建',
    subtitle: '3D ASSET LIBRARY',
    description: '用于营销活动使用的相关3D元素库搭建。基于Blender与C4D，统一视觉规范，提升团队产出效率。',
    imageUrl: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=1200',
    category: 'kv',
    tags: ['3D Modeling', 'Rendering', 'Efficiency'],
    designBy: '王军震',
    themeColor: '#7c3aed'
  },
  {
    id: '5',
    title: '网约车乘客端节日活动',
    subtitle: 'DIDI FESTIVAL PROMOTION',
    description: '节日的营销活动视觉设计和相关的延展设计。针对APP内资源位进行场景化定制。',
    imageUrl: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=1200',
    category: 'landing',
    tags: ['APP设计', '资源位', '场景化'],
    designBy: '王军震',
    themeColor: '#ff8800'
  },
  {
    id: '6',
    title: '品牌视觉规范',
    subtitle: 'BRAND GUIDELINES',
    description: '为新兴科技企业构建完整的视觉识别系统。',
    imageUrl: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&q=80&w=1200',
    category: 'branding',
    tags: ['Logo Design', 'Typography', 'Iconography'],
    designBy: '王军震',
    themeColor: '#10b981'
  },
  {
    id: '7',
    title: 'AIGC 场景探索',
    subtitle: 'AI GENERATED VISUALS',
    description: '利用 Midjourney 与 Flux 探索电商场景的高保真视觉生成。',
    imageUrl: 'https://images.unsplash.com/photo-1675271591211-126ad94e495d?auto=format&fit=crop&q=80&w=1200',
    category: 'ai',
    tags: ['AI Art', 'Concept', 'E-commerce'],
    designBy: '王军震',
    themeColor: '#3b82f6'
  }
];

export const experiences: any[] = [
  {
    company: '转转',
    logo: 'https://pic1.zhuanzhuan.com/zhuanzhuan/n_v2e6b20c9f116a4401bb17066d956a7605.png', // Official logo from web search logic
    role: '运营视觉设计师 | 转转平台设计',
    period: '2024年7月-至今',
    color: '#ff4d4f',
    details: [
      '【B2C业务】：平台大促视觉设计/日常活动设计',
      '【租赁业务】：日常营销活动设计',
      '【AI模型训练】：IP转转熊Lora模型训练'
    ]
  },
  {
    company: '滴滴',
    logo: 'https://www.didiglobal.com/favicon.ico', // Placeholder for Didi logo
    role: '创意视觉实习生 | 网约车平台设计',
    period: '2023年10月-2024年4月',
    color: '#ff8800',
    details: [
      '【网约车乘客端APP】：节日的营销活动视觉设计和相关的延展设计。',
      '【网约车司机端APP】：司机端资源位的活动入口设计。',
      '【3D素材库搭建】：用于营销活动使用的相关3D元素库搭建。'
    ]
  }
];

