import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import {
  Button,
  TextField,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Container,
  Paper,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";


export default function PostWrite() {
  const [title, setTitle] = useState("");
  const [hashtag, setHashtags] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("jwt");
    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/login");
    }
  }, [navigate]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);

      for (const file of newFiles) {
        if (file.type.startsWith("image")) {
          const formData = new FormData();
          formData.append("files", file);

          try {
            await api.post("/post/image", formData);
          } catch (error) {
            console.error("이미지 업로드 중 오류 발생:", error);
            alert("이미지 업로드 실패: 콘솔을 확인하세요.");
          }
        }
      }
    }
  };

  const handleFileRemove = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("hashtag", hashtag);
    formData.append("content", content);
    files.forEach((file) => formData.append("files", file));
    formData.append("userId", sessionStorage.getItem("userId")!);

    try {
      await api.post("/post", formData);

      alert("게시글이 등록되었습니다.");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("등록 중 오류가 발생했습니다.");
    }
  };

  const handleCancel = () => {
    if (window.confirm("작성 중인 내용을 취소하시겠습니까?")) {
      setTitle("");
      setHashtags("");
      setContent("");
      setFiles([]);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
      <Paper elevation={3} sx={{ p: 5, borderRadius: 3 }}>
        <Box display="flex" flexDirection="column" gap={3}>
          <Grid size={{ xs: 12 }}>
            <TextField
              label="제목"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              label="해시태그"
              value={hashtag}
              onChange={(e) => setHashtags(e.target.value)}
              placeholder="예: #프로젝트, #공지, #노션"
              fullWidth
              helperText="쉼표(,)로 구분하여 입력"
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              label="본문 내용"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              multiline
              rows={8}
              fullWidth
            />
          </Grid>


          <Grid size={{ xs: 12 }}>
            <Box display="flex" alignItems="center" gap={2}>
              <Button variant="outlined" component="label">
                파일 업로드
                <input type="file" multiple hidden onChange={handleFileChange} />
              </Button>
            </Box>
            <List dense>
              {files.map((file, idx) => (
                <ListItem
                  key={idx}
                  secondaryAction={
                    <IconButton edge="end" onClick={() => handleFileRemove(idx)}>
                      <CloseIcon />
                    </IconButton>
                  }
                >
                  <ListItemText primary={file.name} />
                </ListItem>
              ))}
            </List>
          </Grid>

          <Grid size={{ xs: 12 }} display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="contained" color="primary" onClick={handleSave}>
              등록
            </Button>
            <Button variant="outlined" onClick={handleCancel}>
              취소
            </Button>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}
