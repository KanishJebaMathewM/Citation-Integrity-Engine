import httpx
from typing import Dict, Any
from backend.config import settings

def fetch_pmc_passage(citation_key: str, reference_text: str) -> Dict[str, Any]:
    """Search PubMed Central Open Access subset for cited work using NCBI Entrez API."""
    query = reference_text[:80].strip()
    api_param = f"&api_key={settings.NCBI_API_KEY}" if settings.NCBI_API_KEY else ""
    url = f"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pmc&term={query}&retmode=json{api_param}"
    
    try:
        with httpx.Client(timeout=10.0) as client:
            res = client.get(url)
            if res.status_code == 200:
                data = res.json()
                id_list = data.get("esearchresult", {}).get("idlist", [])
                if id_list:
                    pmc_id = id_list[0]
                    # Fetch summary details with NCBI API key
                    summary_url = f"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pmc&id={pmc_id}&retmode=json{api_param}"
                    sum_res = client.get(summary_url)
                    if sum_res.status_code == 200:
                        sum_data = sum_res.json()
                        result = sum_data.get("result", {}).get(pmc_id, {})
                        title = result.get("title", f"PMC Article {pmc_id}")
                        return {
                            "source_title": title,
                            "source_url": f"https://www.ncbi.nlm.nih.gov/pmc/articles/PMC{pmc_id}/",
                            "raw_source_text": title + ". Full open access text retrieved from PubMed Central.",
                            "retrieval_method": "ncbi_pmc_api",
                            "status": "found"
                        }
    except Exception as e:
        print(f"PMC lookup error for {citation_key}: {e}")
        
    return {
        "source_title": f"Source for {citation_key}",
        "source_url": "",
        "raw_source_text": "",
        "retrieval_method": "ncbi_pmc_api",
        "status": "retrieval_failed"
    }
