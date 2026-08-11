import axios from "axios";
import {
  Container,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Chip,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState } from "react";

// Gmail SVG icon (official brand colors)
function GmailIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path fill="#EA4335" d="M6 40h6V22.5L4 17v21c0 1.1.9 2 2 2z" />
      <path fill="#34A853" d="M36 40h6c1.1 0 2-.9 2-2V17l-8 5.5V40z" />
      <path fill="#FBBC05" d="M36 10l-12 8.5L12 10H6l18 13 18-13h-6z" />
      <path fill="#4285F4" d="M4 17l8 5.5V10H6c-1.1 0-2 .9-2 2v5z" />
      <path fill="#C5221F" d="M44 12v5l-8 5.5V10h6c1.1 0 2 .9 2 2z" />
    </svg>
  );
}

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#7c6fcd" },
    secondary: { main: "#a78bfa" },
    background: { default: "#0d0d14", paper: "#13131f" },
    text: { primary: "#e2e0f0", secondary: "#9492b8" },
  },
  typography: {
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  shape: { borderRadius: 14 },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "& fieldset": { borderColor: "#2a2847", transition: "border-color 0.2s" },
          "&:hover fieldset": { borderColor: "#7c6fcd" },
          "&.Mui-focused fieldset": { borderColor: "#a78bfa", boxShadow: "0 0 0 3px rgba(124,111,205,0.18)" },
          backgroundColor: "#0d0d14",
          borderRadius: 14,
          transition: "box-shadow 0.2s",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: { color: "#9492b8", "&.Mui-focused": { color: "#a78bfa" } },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          "&:hover": { backgroundColor: "rgba(124,111,205,0.15)" },
          "&.Mui-selected": { backgroundColor: "rgba(124,111,205,0.25)" },
          "&.Mui-selected:hover": { backgroundColor: "rgba(124,111,205,0.35)" },
          transition: "background-color 0.15s",
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        icon: { color: "#9492b8" },
      },
    },
  },
});

const toneOptions = [
  { value: "", label: "No preference", emoji: "✦" },
  { value: "professional", label: "Professional", emoji: "💼" },
  { value: "friendly", label: "Friendly", emoji: "😊" },
  { value: "casual", label: "Casual", emoji: "🤙" },
  { value: "formal", label: "Formal", emoji: "🎩" },
  { value: "concise", label: "Concise", emoji: "⚡" },
];

export default function App() {
  const [emailContent, setEmailContent] = useState("");
  const [tone, setTone] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedReply, setGeneratedReply] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post("https://ai-powered-email-reply-generator-8ms9.onrender.com/api/email/generate", {
        emailContent,
        tone,
      });
      setGeneratedReply(
        typeof response.data === "string"
          ? response.data
          : JSON.stringify(response.data)
      );
    } catch (err) {
      setError("Failed to generate reply. Make sure your backend is running on port 8080.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!generatedReply) return;
    await navigator.clipboard.writeText(generatedReply);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenInGmail = async () => {
    if (!generatedReply) return;
    // Copy to clipboard first — Gmail URL truncates long bodies
    try {
      await navigator.clipboard.writeText(generatedReply);
      setCopied(true);
    } catch {
      // Clipboard may fail in insecure contexts; still open Gmail
    }
    const params = new URLSearchParams({
      view: "cm",
      fs: "1",
      tf: "1",
      body: generatedReply,
    });
    window.open(
      `https://mail.google.com/mail/?${params.toString()}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const charCount = emailContent.length;

  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          minHeight: "100vh",
          background: "radial-gradient(ellipse at 20% 10%, #1a1535 0%, #0d0d14 55%, #0a0a10 100%)",
          py: { xs: 3, md: 6 },
        }}
      >
        <Container maxWidth="md">
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 5 }}>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                px: 2,
                py: 0.6,
                mb: 2.5,
                borderRadius: 99,
                border: "1px solid rgba(124,111,205,0.35)",
                background: "rgba(124,111,205,0.08)",
              }}
            >
              <Box
                sx={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  bgcolor: "#a78bfa",
                  boxShadow: "0 0 8px #a78bfa",
                  animation: "pulse 2s ease-in-out infinite",
                  "@keyframes pulse": {
                    "0%,100%": { opacity: 1 },
                    "50%": { opacity: 0.4 },
                  },
                }}
              />
              <Typography sx={{ fontSize: 12, color: "#a78bfa", letterSpacing: 1.2, fontWeight: 600, textTransform: "uppercase" }}>
                AI Powered
              </Typography>
            </Box>

            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                fontSize: { xs: "1.9rem", sm: "2.6rem", md: "3rem" },
                background: "linear-gradient(135deg, #e2e0f0 0%, #a78bfa 60%, #7c6fcd 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                lineHeight: 1.2,
                mb: 1.5,
              }}
            >
              Email Reply Generator
            </Typography>
            <Typography sx={{ color: "#9492b8", fontSize: "1rem", maxWidth: 420, mx: "auto" }}>
              Paste an email, pick a tone, and get a polished reply in seconds.
            </Typography>
          </Box>

          {/* Card */}
          <Box
            sx={{
              background: "rgba(19,19,31,0.85)",
              border: "1px solid rgba(42,40,71,0.8)",
              borderRadius: 4,
              p: { xs: 2.5, sm: 4 },
              backdropFilter: "blur(12px)",
              boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
            }}
          >
            {/* Input section */}
            <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.4, color: "#9492b8", textTransform: "uppercase", mb: 1.5 }}>
              Original Email
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={6}
              variant="outlined"
              placeholder="Paste the email you want to reply to…"
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              sx={{ mb: 0.5 }}
              inputProps={{ style: { fontSize: "0.93rem", lineHeight: 1.65 } }}
            />
            <Typography sx={{ fontSize: 11, color: charCount > 4000 ? "#f87171" : "#9492b8", textAlign: "right", mb: 3, transition: "color 0.2s" }}>
              {charCount} characters
            </Typography>

            {/* Tone selector */}
            <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.4, color: "#9492b8", textTransform: "uppercase", mb: 1.5 }}>
              Tone
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
              {toneOptions.map((opt) => (
                <Chip
                  key={opt.value}
                  label={`${opt.emoji} ${opt.label}`}
                  onClick={() => setTone(opt.value)}
                  variant={tone === opt.value ? "filled" : "outlined"}
                  sx={{
                    cursor: "pointer",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    borderRadius: 99,
                    px: 0.5,
                    border: "1px solid",
                    borderColor: tone === opt.value ? "#7c6fcd" : "#2a2847",
                    bgcolor: tone === opt.value ? "rgba(124,111,205,0.25)" : "transparent",
                    color: tone === opt.value ? "#c4b5fd" : "#9492b8",
                    transition: "all 0.18s ease",
                    "&:hover": {
                      borderColor: "#7c6fcd",
                      color: "#c4b5fd",
                      bgcolor: "rgba(124,111,205,0.12)",
                      transform: "translateY(-1px)",
                    },
                  }}
                />
              ))}
            </Box>

            {/* Generate button */}
            <Button
              fullWidth
              variant="contained"
              disabled={!emailContent.trim() || loading}
              onClick={handleSubmit}
              sx={{
                py: 1.5,
                fontSize: "0.95rem",
                fontWeight: 700,
                letterSpacing: 0.5,
                borderRadius: 3,
                background: "linear-gradient(135deg, #7c6fcd, #a78bfa)",
                boxShadow: "0 4px 20px rgba(124,111,205,0.35)",
                textTransform: "none",
                transition: "all 0.2s ease",
                "&:hover": {
                  background: "linear-gradient(135deg, #6b5ec2, #9575f7)",
                  boxShadow: "0 6px 28px rgba(124,111,205,0.5)",
                  transform: "translateY(-1px)",
                },
                "&:active": { transform: "translateY(0)" },
                "&.Mui-disabled": { background: "#1e1d30", color: "#4a4870" },
              }}
            >
              {loading ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <CircularProgress size={18} sx={{ color: "#c4b5fd" }} />
                  <span>Generating reply…</span>
                </Box>
              ) : (
                "✦ Generate Reply"
              )}
            </Button>

            {/* Divider */}
            {generatedReply && (
              <Box sx={{ my: 4, borderTop: "1px solid #2a2847", position: "relative" }}>
                <Typography
                  sx={{
                    position: "absolute",
                    top: -10,
                    left: "50%",
                    transform: "translateX(-50%)",
                    bgcolor: "#13131f",
                    px: 2,
                    fontSize: 11,
                    color: "#9492b8",
                    letterSpacing: 1.2,
                    textTransform: "uppercase",
                    fontWeight: 700,
                  }}
                >
                  Generated Reply
                </Typography>
              </Box>
            )}

            {/* Output */}
            {generatedReply && (
              <Box
                sx={{
                  animation: "fadeSlideIn 0.4s ease",
                  "@keyframes fadeSlideIn": {
                    from: { opacity: 0, transform: "translateY(12px)" },
                    to: { opacity: 1, transform: "translateY(0)" },
                  },
                }}
              >
                <Box
                  sx={{
                    background: "#0d0d14",
                    border: "1px solid #2a2847",
                    borderRadius: 3,
                    p: 2.5,
                    mb: 2,
                    minHeight: 120,
                    fontSize: "0.92rem",
                    lineHeight: 1.75,
                    color: "#e2e0f0",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {generatedReply}
                </Box>

                <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
                  {/* Copy button */}
                  <Button
                    variant="outlined"
                    onClick={handleCopy}
                    sx={{
                      flex: "1 1 140px",
                      py: 1.3,
                      fontSize: "0.88rem",
                      fontWeight: 600,
                      borderRadius: 3,
                      textTransform: "none",
                      borderColor: copied ? "#34d399" : "#2a2847",
                      color: copied ? "#34d399" : "#9492b8",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        borderColor: copied ? "#34d399" : "#7c6fcd",
                        color: copied ? "#34d399" : "#c4b5fd",
                        bgcolor: copied ? "rgba(52,211,153,0.06)" : "rgba(124,111,205,0.08)",
                        transform: "translateY(-1px)",
                      },
                    }}
                  >
                    {copied ? "✓ Copied!" : "Copy to Clipboard"}
                  </Button>

                  {/* Open in Gmail button */}
                  <Button
                    variant="outlined"
                    onClick={handleOpenInGmail}
                    startIcon={<GmailIcon size={17} />}
                    sx={{
                      flex: "1 1 140px",
                      py: 1.3,
                      fontSize: "0.88rem",
                      fontWeight: 600,
                      borderRadius: 3,
                      textTransform: "none",
                      borderColor: "#2a2847",
                      color: "#9492b8",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        borderColor: "#EA4335",
                        color: "#f87171",
                        bgcolor: "rgba(234,67,53,0.07)",
                        transform: "translateY(-1px)",
                        "& svg": { filter: "drop-shadow(0 0 4px rgba(234,67,53,0.5))" },
                      },
                    }}
                  >
                    Open in Gmail
                  </Button>
                </Box>
              </Box>
            )}
          </Box>

          <Typography sx={{ textAlign: "center", mt: 4, fontSize: 12, color: "#4a4870" }}>
            Replies are AI-generated — review before sending.
          </Typography>
        </Container>

        {/* Error snackbar */}
        <Snackbar open={!!error} autoHideDuration={5000} onClose={() => setError("")} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
          <Alert severity="error" onClose={() => setError("")} sx={{ borderRadius: 2 }}>
            {error}
          </Alert>
        </Snackbar>

        {/* Copied snackbar */}
        <Snackbar open={copied} autoHideDuration={3000} onClose={() => setCopied(false)} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
          <Alert severity="success" onClose={() => setCopied(false)} sx={{ borderRadius: 2 }}>
            Copied! If Gmail doesn't prefill the full text, just paste (Ctrl+V).
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}