import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    DEEPSEEK_API_KEY: str = os.getenv("DEEPSEEK_API_KEY", "")
    
    # Auto-select provider based on available keys if not explicitly set
    @property
    def MODEL_PROVIDER(self) -> str:
        provider = os.getenv("MODEL_PROVIDER", "")
        if provider:
            return provider.lower()
        if self.OPENAI_API_KEY:
            return "openai"
        if self.GEMINI_API_KEY:
            return "gemini"
        if self.DEEPSEEK_API_KEY:
            return "deepseek"
        return "openai"

    @property
    def CRITIC_MODEL_NAME(self) -> str:
        default = "gpt-4o" if self.MODEL_PROVIDER == "openai" else "gemini-1.5-pro"
        return os.getenv("CRITIC_MODEL_NAME", default)

    @property
    def REDTEAM_MODEL_NAME(self) -> str:
        default = "gpt-4o" if self.MODEL_PROVIDER == "openai" else "gemini-1.5-pro"
        return os.getenv("REDTEAM_MODEL_NAME", default)

    @property
    def UTILITY_MODEL_NAME(self) -> str:
        default = "gpt-4o-mini" if self.MODEL_PROVIDER == "openai" else "gemini-1.5-flash"
        return os.getenv("UTILITY_MODEL_NAME", default)

    ARXIV_API_BASE: str = os.getenv("ARXIV_API_BASE", "http://export.arxiv.org/api/query")
    PMC_API_BASE: str = os.getenv("PMC_API_BASE", "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi")
    
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./cie.db")
    BACKEND_PORT: int = int(os.getenv("BACKEND_PORT", "8000"))
    FRONTEND_PORT: int = int(os.getenv("FRONTEND_PORT", "5173"))
    
    INPUT_TOKEN_COST_PER_1K: float = float(os.getenv("INPUT_TOKEN_COST_PER_1K", "0.00025"))
    OUTPUT_TOKEN_COST_PER_1K: float = float(os.getenv("OUTPUT_TOKEN_COST_PER_1K", "0.00075"))

settings = Settings()
