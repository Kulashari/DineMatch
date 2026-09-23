from typing import Annotated

from fastapi import APIRouter, Depends, status

from dinematch_api.api.schemas.recommendations import (
    RecommendationRequestBody,
    RecommendationResponseBody,
)
from dinematch_api.application.recommendations.service import RecommendationService
from dinematch_api.bootstrap.dependencies import get_recommendation_service


router = APIRouter(prefix="/v1/recommendations", tags=["recommendations"])


@router.post("", response_model=RecommendationResponseBody, status_code=status.HTTP_200_OK)
def create_recommendation(
    request: RecommendationRequestBody,
    service: Annotated[RecommendationService, Depends(get_recommendation_service)],
) -> RecommendationResponseBody:
    result = service.recommend(request.to_domain())
    return RecommendationResponseBody.from_domain(result)
