import { StoryChapter, WeddingInfo } from './types';

export const STORY_DATA: StoryChapter[] = [
  {
    id: 1,
    title: "ACT I: THE ENCOUNTER",
    subtitle: "2020.05.20 · 镜头初见",
    image: "https://images.unsplash.com/photo-1518131359143-b893f44a9c87?auto=format&fit=crop&q=80&w=2000",
    quote: "人生如戏，而你是我生命里最动人的长镜头。在那场不期而遇的雨后，我们的故事悄然开机。"
  },
  {
    id: 2,
    title: "ACT II: THE JOURNEY",
    subtitle: "1,200 公里的蒙太奇",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=2000",
    quote: "不是在最好的时光遇见了你，而是遇见你，才有了最好的时光。穿过半个中国，只为与你同框。"
  },
  {
    id: 3,
    title: "ACT III: THE VOWS",
    subtitle: "2023.12.24 · 永恒定格",
    image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=2000",
    quote: "从今以后，剧本的每一页，我们共同书写。你是导演，也是我唯一的主角。"
  }
];

export const WEDDING_DETAILS: WeddingInfo = {
  groom: "张慕寒",
  bride: "林晓悦",
  date: "2024.10.10",
  time: "11:58 AM",
  location: "悦榕庄 · 临江大礼堂",
  address: "上海市黄浦区中山东一路 32 号"
};

export const CREDITS = [
  { role: "领衔主演 Starring", names: "张慕寒 & 林晓悦" },
  { role: "总制片人 Executive Producers", names: "双方父母及至亲" },
  { role: "特邀嘉宾 Guest Appearance", names: "见证爱情的您" },
  { role: "公映日期 Release Date", names: "2024年10月10日" }
];

export const BG_MUSIC_URL = "https://assets.mixkit.co/music/preview/mixkit-beautiful-dream-493.mp3";