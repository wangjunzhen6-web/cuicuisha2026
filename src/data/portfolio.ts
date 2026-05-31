import { Project, WorkExperience } from "../types";

/**
 * Project Data
 * Tip: For local images, place them in the /public folder and use absolute paths
 * e.g., imageUrl: "/my-project-shot.png"
 */
export const projects: Project[] = [
  {
    id: "3",
    title: "摄影出游季",
    subtitle: "TRAVEL PHOTO SEASON",
    description:
      "借助假期出游热度，转转为迎接用户旅行拍照需求，针对拍照类手机推出了丰厚的优惠券。旨在提升GMV规模，助力手机达成订单目标",
    imageUrl:
      "/src/assets/images/input_file_1.png",
    category: "landing",
    tags: ["大促设计", "视觉落地", "摄影出行"],
    designBy: "王军震",
    themeColor: "#ff4d4f",
    layout: "cyber",
    strategy: [
      "使用出行工具为背景氛围，增强页面的旅游出行感受",
      "颜色采用符合季节的主色调",
      "利用AI生成摄影类素材图来解决没有对应素材图的痛点",
    ],
    secondaryImages: [
      "/src/assets/images/input_file_1.png", // 0: Top KV representation
      "/src/assets/images/regenerated_image_1779597241074.jpg", // 1: Moodboard (情绪版)
      "/src/assets/images/input_file_1.png", // 2: Secondary KV showcase
      "/src/assets/images/input_file_8.png", // 3: Autumn "金秋出游"
      "/src/assets/images/input_file_4.png", // 4: Winter "冬日寻趣"
      "/src/assets/images/input_file_9.png", // 5: Daily "拍照神器"
    ],
  },
  {
    id: "8",
    title: "羊角角IP设计",
    subtitle: "SHEEP CORNER IP DESIGN",
    description:
      "羊角角表面是个总犯困的小羊， 实际上是专门执行夜间秘密行动的成员。 喜欢足球、夜跑、滑板 and 深夜一个人待着。 有时候会在早上收到神秘消息： 没人知道羊角角真正的任务是什么。 只知道每当夜晚降临， 它就会消失在城市里。🌙它会穿过没人的小巷、便利店门口、凌晨的天桥。专门接那些奇怪的任务：回收被丢掉的梦想、寻找失踪的快乐、或者偷偷暗杀掉人类今天的坏情绪。",
    imageUrl: "/src/assets/images/regenerated_image_1779007978012.png",
    category: "personal",
    tags: ["3D建模", "角色设计", "插图"],
    designBy: "王军震",
    themeColor: "#4A90E2",
    layout: "dynamic",
    secondaryImages: [
      "/src/assets/images/regenerated_image_1779007978012.png", // 0: 16:9 Hero
      "/src/assets/images/input_file_4.png", // 1: 草图
      "/src/assets/images/input_file_8.png", // 2: 白膜
      "/src/assets/images/input_file_sketch_3.png", // 3: 彩绘
      "/src/assets/images/input_file_sketch_bg.png", // 4: 背景线稿
      "/src/assets/images/input_file_1.png", // 5: Showcase Lineup
      "/src/assets/images/regenerated_image_1779002206742.mp4", // 6: Story Video
    ],
  },
  {
    id: "9",
    title: "氢弹大促・新春年货节",
    subtitle: "SPRING FESTIVAL CARNIVAL",
    description:
      "项目背景：\n借力春节年货消费热潮打造「氢弹大促」营销活动，针对新客、老客、高粘性核心用户等不同圈层人群，定制分层差异化福利与优惠玩法，精准撬动不同用户消费潜力，最大化活动转化。",
    imageUrl:
      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=1200",
    category: "landing",
    tags: ["大促设计", "新春年味", "视觉落地", "趣味抢购"],
    designBy: "王军震",
    themeColor: "#e11d48",
    layout: "cyber",
    strategy: [
      "强化浓厚新春年味，清晰展示活动商品与优惠亮点",
      "打造趣味互动视觉，烘托热闹抢购氛围，加深用户记忆点",
      "结合 AI 设计工具全流程提效，快速产出多版本视觉物料",
      "深度融合春节传统视觉符号，还原居家过年场景，氛围感拉满",
      "以「商品破屏」和群体互动创造戏剧感，视觉生动吸睛",
      "主次分明展示年货商品，直观传递大促力度",
    ],
    secondaryImages: [
      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=600",
      "/src/assets/images/regenerated_image_1779597196859.jpg",
      "https://images.unsplash.com/photo-1563298723-dcfebaa392e3?auto=format&fit=crop&q=80&w=600",
      "/src/assets/images/regenerated_image_1779592516053.jpg",
      "/src/assets/images/regenerated_image_1779592603233.jpg",
      "/src/assets/images/regenerated_image_1779592906318.jpg",
      "/src/assets/images/input_file_11.mp4",
      "/src/assets/images/mobile_landing_animation_1.mp4",
      "/src/assets/images/mobile_landing_animation_2.mp4",
      "/src/assets/images/regenerated_image_1779814741616.jpg",
      "/src/assets/images/regenerated_image_1779814840378.jpg",
      "/src/assets/images/regenerated_image_1779814888473.jpg",
      "/src/assets/images/regenerated_image_1779597003959.jpg",
      "/src/assets/images/regenerated_image_1779592919714.jpg",
      "/src/assets/images/regenerated_image_1779592930990.jpg",
      "/src/assets/images/regenerated_image_1779597241074.jpg",
      "/src/assets/images/regenerated_image_1779597196859.jpg",
    ],
  },
  {
    id: "10",
    title: "开春出行季",
    subtitle: "SPRING TRAVEL CAMPAIGN",
    description: "春日融融，暖风拂面，户外旅行与踏春拍照热度飙升。转转平台顺应潮流推出「开春出行季」营销专区活动，主打精选运动穿戴与手持摄影神器日租福利。项目视觉落地围绕“春日出游，一拍封神”的核心概念，将潮流大疆 Pocket 3 及高端配件置于自然年轮木墩上，完美契合开春清新鲜活的主色调。旨在直击出游核心转化点，通过视觉冲击力实现品类租售转化的全新突破。",
    imageUrl: "/src/assets/images/spring_travel_kv_1779886513533.png",
    category: "landing",
    tags: ["营销视觉", "产品精细渲染", "租售转化大促"],
    designBy: "王军震",
    themeColor: "#2b82f6",
    layout: "cyber",
    strategy: [
      "微缩春色拟物化结构：将摄影机与奢华配件置于天然年轮木墩和潺潺欢畅的溪流中，营造极富生机的春日出游故事感",
      "黄金分割出游色彩体系：提炼明朗的天空蓝、薄荷绿、暖阳橙作为辅助配色，奠定高活跃、踏春度假、温暖春日色调体系",
      "全链路多端延展提效：运用 3D 渲染器与 AI 图像提速工具相结合，在极短周期内自适应分发宽幅横幅、手机会场、以及品类优惠卡券等多态视觉模态"
    ],
    secondaryImages: [
      "/src/assets/images/spring_travel_kv_1779886513533.png",
      "/src/assets/images/camera_gear_detail_1779886599446.png",
      "/src/assets/images/spring_travel_kv_1779886513533.png",
      "/src/assets/images/camera_gear_detail_1779886599446.png",
      "/src/assets/images/spring_travel_kv_1779886513533.png",
      "/src/assets/images/camera_gear_detail_1779886599446.png"
    ]
  },
  {
    id: "11",
    title: "转转熊IP应用",
    subtitle: "AIGC生成运营视觉场景与活动",
    description: "AIGC生成运营视觉场景与活动",
    imageUrl: "/src/assets/images/zhuanzhuan_bear_kv_1779894206662.png",
    category: "personal",
    tags: ["3D卡通IP", "潮玩手办设计", "LORA模型训练", "视觉规范落地"],
    designBy: "王军震",
    themeColor: "#FF4D4F",
    layout: "dynamic",
    secondaryImages: [
      "/src/assets/images/zhuanzhuan_bear_kv_1779894206662.png",
      "/src/assets/images/bear_art_toy_1_1779894230407.png",
      "/src/assets/images/bear_skate_2_1779894250563.png",
      "/src/assets/images/bear_cyber_3_1779894269826.png",
      "/src/assets/images/bear_street_4_1779894288795.png"
    ],
  },
  {
    id: "12",
    title: "618大促毕业季",
    subtitle: "AIGC GENERATED PROMOTION KV",
    description: "618大促加毕业季，打造专属大促氛围，结合 AI生成背景与交互设计",
    imageUrl: "https://images.unsplash.com/photo-1549421263-6c4caf5141e1?auto=format&fit=crop&q=80&w=1200",
    category: "landing",
    tags: ["大促营销", "毕业季", "AIGC", "交互设计"],
    designBy: "王军震",
    themeColor: "#FF4D4F",
    layout: "dynamic",
    secondaryImages: [
      "https://images.unsplash.com/photo-1549421263-6c4caf5141e1?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1549421263-6c4caf5141e1?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1549421263-6c4caf5141e1?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1549421263-6c4caf5141e1?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1549421263-6c4caf5141e1?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1549421263-6c4caf5141e1?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1549421263-6c4caf5141e1?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1549421263-6c4caf5141e1?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1549421263-6c4caf5141e1?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1549421263-6c4caf5141e1?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1549421263-6c4caf5141e1?auto=format&fit=crop&q=80&w=600"
    ]
  }
];

export const experiences: any[] = [
  {
    company: "转转",
    logo: "/src/assets/images/regenerated_image_1778957787641.png",
    role: "运营视觉设计师 | 转转平台设计",
    period: "2024年7月-至今",
    color: "#ff4d4f",
    details: [
      "【B2C业务】：平台大促视觉设计/日常活动设计",
      "【租赁业务】：日常营销活动设计",
      "【AI模型训练】：IP转转熊Lora模型训练",
    ],
  },
  {
    company: "滴滴",
    logo: "/src/assets/images/regenerated_image_1778957990481.png",
    role: "创意视觉实习生 | 网约车平台设计",
    period: "2023年10月-2024年4月",
    color: "#ff8800",
    details: [
      "【网约车乘客端APP】：节日的营销活动视觉设计和相关的延展设计。",
      "【网约车司机端APP】：司机端资源位的活动入口设计。",
      "【3D素材库搭建】：用于营销活动使用的相关3D元素库搭建。",
    ],
  },
];
