from pydantic import BaseModel
from typing import Any, Dict, List


class AnalysisResponse(BaseModel):

    success: bool

    fileName: str

    totalCompanies: int

    totalRecords: int

    analysisMethod: Dict[str, Any]

    ngoFocus: str

    insights: Dict[str, Any]

    topCompanies: List[Dict[str, Any]]