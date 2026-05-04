import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, List, ListItem, ListItemText, Paper, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Comment, CommentCreateRequest, Post } from "../type";
import { getPostId, softDeletePost } from "../api/postsApi";
import { createComment, deleteCommnet, getComment, updateComment } from "../api/CommentApi";
import { useAuthStore } from "../store";
import { getLikeSummary, toggleLike } from "../api/LikeApi";
import { Heart } from 'lucide-react'
import DOMPurify from "dompurify";
import api from "../api/axiosConfig";

export default function PostPage() {
    const { id } = useParams();
    const { userInfo } = useAuthStore();
    const [eCommentId, setECommentId] = useState<number | null>(null);
    const [open, setOpen] = useState(false);
    const [showFiles, setShowFiles] = useState(false);
    const [liked, setLiked] = useState(false);
    const navigate = useNavigate();
    const [post, setPost] = useState<Post>({
        postId: 0,
        userId: 0,
        title: "",
        content: "",
        createAt: new Date(),
        updateAt: new Date(),
        views: 0,
        hashtag: "",
        fileList: [],
        likeCount: 0,
        nickname: "",
        deleted: false
    });

    //댓글 내용
    const [commentText, setCommentText] = useState("");
    //댓글 리스트
    const [comment, setComment] = useState<Comment[]>([]);

    const fetchPostData = async () => {
        try {
            const postResponse = await getPostId(Number(id)) as any;
            setPost(postResponse);
            setLiked(postResponse.LikedByUser);
            const commentResponse = await getComment(Number(id));
            setComment(commentResponse);
        } catch (error) {
            console.error("데이터 로딩 실패", error);
        }
    };

    useEffect(() => {
        if (id) {
            fetchPostData();
        }
    }, [])

    // 삭제(휴지통)
    const handleSoftDelete = async () => {
        if (!post?.postId) return;
        const confirmDelete = window.confirm("정말로 게시글을 삭제하시겠습니까?");
        if (!confirmDelete) return;
        try {
            await softDeletePost(post.postId);
            alert("게시글이 삭제되었습니다.");
            navigate("/")
        } catch (error) {
            console.error("임시 삭제 중 오류 발생:", error);
        }
    };

    // 댓글 작성 / 수정
    const handleSubmit = async () => {
        if (!commentText || !userInfo) return;
        // ... (댓글 작성/수정 로직은 변경 없음)
        if (eCommentId) {
            // 수정 모드일 경우
            try {
                await updateComment({
                    commentId: eCommentId,
                    postId: post.postId,
                    comment: commentText
                });
                alert("댓글이 수정되었습니다.");
                setOpen(false);
            } catch (err) {
                console.error(err);
                alert("댓글 수정에 실패했습니다.");
            }
        } else {
            // 새 댓글 등록
            const commentData: CommentCreateRequest = {
                postId: Number(id),
                userId: userInfo.userId,
                comment: commentText,
                nickname: userInfo.nickname,
            };

            try {
                await createComment(commentData);
                alert("댓글이 성공적으로 등록되었습니다!");
            } catch (error) {
                alert("댓글 등록 실패");
                console.error(error);
            }
        }

        // 공통 처리
        setCommentText("");
        setECommentId(null);
        fetchPostData();
    };

    //댓글 삭제
    const handleComDelete = async (commentId: number) => {
        if (!id) return;

        const confirmDelete = window.confirm("정말로 이 댓글을 삭제하시겠습니까?");
        if (!confirmDelete) return;

        try {
            await deleteCommnet({
                postId: Number(id),
                commentId: commentId
            });
            alert("댓글이 삭제되었습니다.");
            fetchPostData();
        } catch (error) {
            alert("삭제 실패");
            console.error(error);
        }
    }

    // 댓글 수정
    const handleComEdit = async (comment: Comment) => {
        setCommentText(comment.comment);
        setOpen(true);
        setECommentId(comment.commentId);
    };

    const handleClose = () => {
        setOpen(false);
        setCommentText("");
        setECommentId(null)
    }

    // 좋아요
    const handleLikeToggle = async () => {
        if (!userInfo || !post?.postId) return;

        try {
            await toggleLike(post.postId);
            const summary = await getLikeSummary(post.postId) as any; // liked + likeCount
            setLiked(summary.data.liked);
            setPost(prev => ({ ...prev, likeCount: summary.data.likeCount }));
        } catch (error) {
            console.error("좋아요 처리 중 오류 발생:", error);
        }

    };

    //다운로드
    const downloadFile = async (fileName: string) => {
        try {
            const res = await api.get(
                `/post/files/download?filename=${encodeURIComponent(fileName)}`,
                { responseType: "blob" }
            );

            const blob = new Blob([res.data as BlobPart]);
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("다운로드 실패:", error);
            alert("파일 다운로드 실패");
        }
    };



    return (
        <>
            <Container maxWidth="sm">
                {/* 게시글 제목 및 수정/삭제 버튼 */}
                <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mt: 4, borderBottom: '1px solid #eee', pb: 1 }}>
                    <Typography variant="h4" component="h1">{post.title}</Typography>

                    {/* 수정/삭제 버튼 그룹 (권한 체크) */}
                    {(userInfo?.userId === post.userId || userInfo?.role === 'ADMIN') && (
                        <Box display="flex" gap={1}>
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={() => navigate(`/post/edit/${post.postId}`)}
                            >
                                수정
                            </Button>
                            <Button variant="outlined" color="error" size="small" onClick={handleSoftDelete}>
                                삭제
                            </Button>
                        </Box>
                    )}
                </Box>

                {/* 작성 정보 및 좋아요 */}
                <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2, pt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        작성자: {post.nickname} / 작성일: {new Date(post.createAt).toLocaleString()}
                        {post.updateAt && ` / 수정일: ${new Date(post.updateAt).toLocaleString()}`}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="body2">{post.likeCount}</Typography>
                        <IconButton onClick={handleLikeToggle} disabled={!userInfo}>
                            <Heart
                                color={liked ? 'red' : 'gray'}
                                fill={liked ? 'red' : 'none'}
                            />
                        </IconButton>
                    </Box>
                </Box>

                {/* 첨부파일 보기 버튼 */}
                <Box display="flex" justifyContent="flex-end" alignItems="center" sx={{ mb: 2 }}>
                    <Button variant="outlined" onClick={() => setShowFiles(prev => !prev)}>
                        첨부파일 {showFiles ? '숨기기' : '보기'}
                    </Button>
                </Box>

                {/* 이미지 + 본문 내용 (구역 구분 없이 자연스럽게 렌더링) */}
                <Box sx={{ mb: 3, minHeight: '150px' }}>
                    {post.fileList
                        .filter(file => file.imageYn === "Y")
                        .map((file, idx) => (
                            <img
                                key={idx}
                                src={`${import.meta.env.VITE_API_URL}${file.fileUrl}`}
                                alt={file.fileOrgname}
                                style={{
                                    width: "100%",
                                    height: "auto",
                                    borderRadius: 4,
                                    marginBottom: "12px"
                                }}
                            />
                        ))}

                    <div
                        style={{ 
                            whiteSpace: 'pre-wrap', 
                            color: 'black',
                            wordBreak: 'break-word'
                        }}
                        dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(post.content),
                        }}
                    />
                </Box>


                {/* 모든 첨부파일 다운로드 리스트 (이미지 포함) */}
                {showFiles && (
                    <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
                        <Typography variant="subtitle1">📎 첨부파일</Typography>
                        <List>
                            {post.fileList.map((file, idx) => (
                                <ListItem key={idx} sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <ListItemText
                                        primary={file.fileOrgname}
                                        secondary={`용량: ${file.fileSize}KB / 유형: ${file.imageYn === 'Y' ? '이미지' : '기타'}`}
                                    />
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={() => downloadFile(file.fileName)}
                                    >
                                        다운로드
                                    </Button>
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                )}

                <Typography variant="h6" sx={{ mt: 4 }}>댓글</Typography>

                {/* 댓글 입력 폼 (로그인 시에만 표시) */}
                {userInfo ? (
                    <Box display="flex" flexDirection="column" gap={2}>
                        <TextField
                            label="댓글"
                            name="comment"
                            variant="outlined"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            multiline
                            minRows={3}
                            required
                        />
                        <Button variant="contained" color="primary" onClick={handleSubmit} disabled={!commentText.trim()}>
                            등록
                        </Button>
                    </Box>
                ) : (
                    <Box sx={{ p: 2, my: 2, border: '1px dashed #ccc', textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            댓글을 작성하려면 로그인해주세요.
                        </Typography>
                    </Box>
                )}

                {/* 댓글 목록 표시 */}
                <Box sx={{ mt: 4 }}>
                    {comment.length > 0 ? (
                        comment.map((comment, index) => (
                            <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: '4px' }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    {comment.nickname}
                                </Typography>
                                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                                    {comment.comment}
                                </Typography>

                                {/* 댓글 수정/삭제 버튼은 작성자에게만 표시 */}
                                {userInfo?.userId === comment.userId || userInfo?.role === "ADMIN" && (
                                    <Box sx={{ mt: 1, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={() => handleComEdit(comment)}
                                        >
                                            수정
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            size="small"
                                            onClick={() => handleComDelete(comment.commentId)}
                                        >
                                            삭제
                                        </Button>
                                    </Box>
                                )}

                            </Box>
                        ))
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                            아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!
                        </Typography>
                    )}
                </Box>

                {/* 댓글 수정 다이얼로그 */}
                <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                    <DialogTitle>댓글 수정</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="댓글 내용"
                            fullWidth
                            multiline
                            minRows={3}
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>취소</Button>
                        <Button onClick={handleSubmit} variant="contained" color="primary">저장</Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </>
    );
}