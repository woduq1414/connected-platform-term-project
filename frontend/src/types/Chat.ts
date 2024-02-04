import { Company, Country, Language } from './Common';
import { Genre } from './Genre';

export type Chatting = {
    userId: number;
    nickname: string;
    profileImage: string;
    color: number;
    content: string;
    createdAt: number;
    videoAt: number;
};

export type ChatUser = {
    userId: number;
    nickname: string;
    profileImage: string;
    color: number;
    live: boolean;
}