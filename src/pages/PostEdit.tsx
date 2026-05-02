import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  TextField,
  Container,
  Paper,
  Box,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface FileType {
  name: string;
  url?: string;  // 기존 파일이면 url 존재
  file?: File;   // 새로 업로드된 파일
  id?: number;   // 기존 파일 ID
}

export default function PostEdit() {
  const { id } = useParams(); // 게시글 ID
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [hashtag, setHashtags] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<FileType[]>([]);
  const [removedFiles, setRemovedFiles] = useState<number[]>([]);

  // 로그인 확인 및 기존 게시글 불러오기
  useEffect(() => {
    const token = sessionStorage.getItem("jwt");
    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    fetch(`http://localhost:8080/post/${id}`, {
      headers: { Authorization: token },
    })
      .then(res => {
        if (!res.ok) throw new Error("게시글을 불러오지 못했습니다.");
        return res.json();
      })
      .then(data => {
        setTitle(data.title);
        setHashtags(data.hashtag);
        setContent(data.content);

        // 기존 파일 세팅
        const existingFiles = data.fileList.map((f: any) => ({
          name: f.fileOrgname,
          url: f.fileUrl,
          id: f.fileId
        }));
        setFiles(existingFiles);
      })
      .catch(err => {
        console.error(err);
        alert("게시글 정보를 불러오는 중 오류가 발생했습니다.");
      });
  }, [id, navigate]);

  // 새 파일 추가
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles: FileType[] = Array.from(e.target.files).map(file => ({
        name: file.name,
        file: file,
      }));
      setFiles([...files, ...newFiles]);
    }
  };

  // 파일 삭제
  const handleFileRemove = (index: number) => {
    const removed = files[index];
    if (removed.id) setRemovedFiles([...removedFiles, removed.id]);
    setFiles(files.filter((_, i) => i !== index));
  };

  // 게시글 수정 요청
  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("hashtag", hashtag);
    formData.append("content", content);

    // 새로 추가된 파일만 formData에 포함
    files.forEach(file => {
      if (!file.url && file.file) formData.append("files", file.file);
    });

    // 삭제할 기존 파일 ID 전달
    removedFiles.forEach(id => formData.append("removedFiles", id.toString()));

    try {
      const res = await fetch(`http://localhost:8080/post/${id}`, {
        method: "PUT",
        body: formData,
        headers: { Authorization: sessionStorage.getItem("jwt")! },
      });

      if (!res.ok) throw new Error("수정 실패");

      alert("게시글이 수정되었습니다.");
      navigate("/"); // 메인 페이지로 이동
    } catch (err) {
      console.error(err);
      alert("수정 중 오류가 발생했습니다.");
    }
  };

  const handleCancel = () => {
    if (window.confirm("수정을 취소하시겠습니까?")) {
      navigate("/");
    }
  };

  return (
    <Box>
      <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
        <Paper elevation={3} sx={{ p: 5, borderRadius: 3 }}>
          <Grid container spacing={4}>
            {/* 제목 */}
            <Grid size={{ xs: 12 }}>
              <TextField
                label="제목"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                variant="outlined"
              />
            </Grid>

            {/* 해시태그 */}
            <Grid size={{ xs: 12 }}>
              <TextField
                label="해시태그"
                value={hashtag}
                onChange={(e) => setHashtags(e.target.value)}
                placeholder="예: #프로젝트, #공지, #노션"
                fullWidth
                variant="outlined"
                helperText="쉼표(,)로 구분하여 입력"
              />
            </Grid>

            {/* 본문 */}
            <Grid size={{ xs: 12 }}>
              <TextField
                label="본문 내용"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                multiline
                rows={8}
                fullWidth
                variant="outlined"
              />
            </Grid>

            {/* 첨부파일 */}
            <Grid size={{ xs: 12 }}>
              <Box display="flex" alignItems="center" gap={2}>
                <Button variant="outlined" component="label">
                  파일 업로드
                  <input
                    type="file"
                    multiple
                    hidden
                    onChange={handleFileChange}
                  />
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
                    <ListItemText
                      primary={file.name}
                      secondary={file.url ? <a href={file.url} target="_blank" rel="noreferrer">보기</a> : null}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>

            {/* 버튼 */}
            <Grid size={{ xs: 12 }} display="flex" justifyContent="flex-end" gap={2}>
              <Button variant="contained" color="primary" onClick={handleUpdate}>
                수정
              </Button>
              <Button variant="outlined" color="inherit" onClick={handleCancel}>
                취소
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}
