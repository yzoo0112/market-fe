import type { PostForm } from "../type";
import api from "./axiosConfig";

// 게시글 등록
export async function createPost(post: PostForm) {
    const formData = new FormData();
    formData.append("title", post.title);
    formData.append("hashtag", post.hashtag);
    formData.append("content", post.content);
    post.files.forEach((file) => {
        formData.append("files", file);
    });

    try {
        const response = await api.post("/post", formData);
        return response.data;
    } catch (error) {
        console.error("게시글 등록 오류:", error);
        throw error;
    }
}

// 게시글 상세 조회
export const getPostId = async (id: number) => {
    const response = await api.get(`/post/${id}`);
    return response.data;
};

// 게시글 삭제
export const deletePost = async (id: number) => {
    const response = await api.delete(`/post/${id}`);
    return response.data;
};

// 게시글 삭제(휴지통)
export const softDeletePost = (id: number) => {
    return api.delete(`/post/${id}`);
};
