import httpx
import xml.etree.ElementTree as ET
from typing import Dict, Any

def fetch_arxiv_passage(citation_key: str, reference_text: str) -> Dict[str, Any]:
    """Search arXiv API by title/author from reference string and return passage data."""
    # Extract candidate title keywords from reference string
    clean_ref = reference_text.replace("\n", " ").strip()
    # Strip author/year prefix if present
    query_title = clean_ref[:100]
    
    url = f"http://export.arxiv.org/api/query?search_query=ti:\"{query_title}\"&max_results=1"
    
    try:
        with httpx.Client(timeout=10.0) as client:
            res = client.get(url)
            if res.status_code == 200:
                root = ET.fromstring(res.text)
                ns = {"atom": "http://www.w3.org/2005/Atom"}
                entry = root.find("atom:entry", ns)
                if entry is not None:
                    title = entry.find("atom:title", ns).text.strip().replace("\n", " ")
                    summary = entry.find("atom:summary", ns).text.strip().replace("\n", " ")
                    link = entry.find("atom:id", ns).text.strip()
                    
                    return {
                        "source_title": title,
                        "source_url": link,
                        "raw_source_text": summary,
                        "retrieval_method": "arxiv_api",
                        "status": "found"
                    }
    except Exception as e:
        print(f"arXiv lookup error for {citation_key}: {e}")
        
    return {
        "source_title": f"Source for {citation_key}",
        "source_url": "",
        "raw_source_text": "",
        "retrieval_method": "arxiv_api",
        "status": "retrieval_failed"
    }
