import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    MODEL_PROVIDER: str = os.getenv("MODEL_PROVIDER", "gemini")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    DEEPSEEK_API_KEY: str = os.getenv("DEEPSEEK_API_KEY", "")
    
    CRITIC_MODEL_NAME: str = os.getenv("CRITIC_MODEL_NAME", "gemini-1.5-pro")
    REDTEAM_MODEL_NAME: str = os.getenv("REDTEAM_MODEL_NAME", "gemini-1.5-pro")
    UTILITY_MODEL_NAME: str = os.getenv("UTILITY_MODEL_NAME", "gemini-1.5-flash")
    
    ARXIV_API_BASE: str = os.getenv("ARXIV_API_BASE", "http://export.arxiv.org/api/query")
    PMC_API_BASE: str = os.getenv("PMC_API_BASE", "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi")
    
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./cie.db")
    BACKEND_PORT: int = int(os.getenv("BACKEND_PORT", "8000"))
    FRONTEND_PORT: int = int(os.getenv("FRONTEND_PORT", "5173"))
    
    INPUT_TOKEN_COST_PER_1K: float = float(os.getenv("INPUT_TOKEN_COST_PER_1K", "0.00025"))
    OUTPUT_TOKEN_COST_PER_1K: float = float(os.getenv("OUTPUT_TOKEN_COST_PER_1K", "0.00075"))

settings = Settings()
