from typing import Protocol, TypedDict

from dinematch_api.core.recommendations.models import (
    Constraint,
    RecommendationRequest,
    RecommendationResult,
    Restaurant,
)


class RecommendationGraph(Protocol):
    def invoke(self, input: "RecommendationGraphState") -> "RecommendationGraphState":
        """Run the compiled orchestration graph for one request."""


class RecommendationGraphState(TypedDict):
    request: RecommendationRequest
    constraints: tuple[Constraint, ...]
    candidates: tuple[Restaurant, ...]
    restaurants: tuple[Restaurant, ...]
    workflow: tuple[str, ...]


class RecommendationService:
    def __init__(self, graph: RecommendationGraph) -> None:
        self._graph = graph

    def recommend(self, request: RecommendationRequest) -> RecommendationResult:
        state = self._graph.invoke(
            {
                "request": request,
                "constraints": (),
                "candidates": (),
                "restaurants": (),
                "workflow": (),
            }
        )
        return RecommendationResult(
            restaurants=state["restaurants"],
            workflow=state["workflow"],
        )
