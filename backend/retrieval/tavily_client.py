import httpx
from typing import Dict, Any
from backend.config import settings

def fetch_tavily_passage(citation_key: str, reference_text: str) -> Dict[str, Any]:
    """Retrieve full text research passage or academic paper snippet using Tavily Search API."""
    if not settings.TAVILY_API_KEY:
        return {
            "source_title": f"Source for {citation_key}",
            "source_url": "",
            "raw_source_text": "",
            "retrieval_method": "tavily_api",
            "status": "retrieval_failed"
        }

    query = f"academic research paper full text: {reference_text[:120].strip()}"
    url = "https://api.tavily.com/search"
    payload = {
        "api_key": settings.TAVILY_API_KEY,
        "query": query,
        "search_depth": "advanced",
        "include_answer": True,
        "max_results": 3
    }
    
    try:
        with httpx.Client(timeout=15.0) as client:
            res = client.post(url, json=payload)
            if res.status_code == 200:
                data = res.json()
                results = data.get("results", [])
                answer = data.get("answer", "")
                if results:
                    top_res = results[0]
                    title = top_res.get("title", f"Tavily Academic Source {citation_key}")
                    source_url = top_res.get("url", "https://tavily.com")
                    content = top_res.get("content", "")
                    combined_text = f"{answer}\n\n{content}".strip()
                    
                    return {
                        "source_title": title,
                        "source_url": source_url,
                        "raw_source_text": combined_text,
                        "retrieval_method": "tavily_academic_search",
                        "status": "found"
                    }
    except Exception as e:
        print(f"Tavily retrieval error for {citation_key}: {e}")

    return {
        "source_title": f"Source for {citation_key}",
        "source_url": "",
        "raw_source_text": "",
        "retrieval_method": "tavily_api",
        "status": "retrieval_failed"
    }
