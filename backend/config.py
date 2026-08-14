import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    AGENT_ROUTER_API_KEY: str = os.getenv("AGENT_ROUTER_API_KEY", os.getenv("OPENROUTER_API_KEY", ""))
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    DEEPSEEK_API_KEY: str = os.getenv("DEEPSEEK_API_KEY", "")
    
    # Research specific API keys (Optional for high-rate retrieval)
    NCBI_API_KEY: str = os.getenv("NCBI_API_KEY", "")
    SEMANTIC_SCHOLAR_API_KEY: str = os.getenv("SEMANTIC_SCHOLAR_API_KEY", "")
    TAVILY_API_KEY: str = os.getenv("TAVILY_API_KEY", "")
    
    # Auto-select provider based on available keys if not explicitly set
    @property
    def MODEL_PROVIDER(self) -> str:
        provider = os.getenv("MODEL_PROVIDER", "")
        if provider:
            return provider.lower()
        if self.OPENAI_API_KEY:
            return "openai"
        if self.AGENT_ROUTER_API_KEY:
            return "agent_router"
        if self.GEMINI_API_KEY:
            return "gemini"
        if self.DEEPSEEK_API_KEY:
            return "deepseek"
        return "openai"

    @property
    def CRITIC_MODEL_NAME(self) -> str:
        if self.MODEL_PROVIDER == "agent_router":
            return os.getenv("CRITIC_MODEL_NAME", "openai/gpt-4o")
        default = "gpt-4o" if self.MODEL_PROVIDER == "openai" else "gemini-1.5-pro"
        return os.getenv("CRITIC_MODEL_NAME", default)

    @property
    def REDTEAM_MODEL_NAME(self) -> str:
        if self.MODEL_PROVIDER == "agent_router":
            return os.getenv("REDTEAM_MODEL_NAME", "openai/gpt-4o")
        default = "gpt-4o" if self.MODEL_PROVIDER == "openai" else "gemini-1.5-pro"
        return os.getenv("REDTEAM_MODEL_NAME", default)

    @property
    def UTILITY_MODEL_NAME(self) -> str:
        if self.MODEL_PROVIDER == "agent_router":
            return os.getenv("UTILITY_MODEL_NAME", "openai/gpt-4o-mini")
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
