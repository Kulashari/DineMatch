from langgraph.graph import END, START, StateGraph

from dinematch_api.application.recommendations.ports import RestaurantCatalog
from dinematch_api.application.recommendations.service import RecommendationGraphState
from dinematch_api.core.recommendations.ranking import rank_restaurants


def build_recommendation_graph(catalog: RestaurantCatalog):
    """Build the five-stage workflow described by the DineMatch MVP."""

    def interpret_preferences(state: RecommendationGraphState) -> RecommendationGraphState:
        return {
            **state,
            "constraints": state["request"].constraints,
            "workflow": (*state["workflow"], "interpret_preferences"),
        }

    def retrieve_restaurants(state: RecommendationGraphState) -> RecommendationGraphState:
        return {
            **state,
            "candidates": catalog.list_candidates(state["request"]),
            "workflow": (*state["workflow"], "retrieve_restaurants"),
        }

    def filter_constraints(state: RecommendationGraphState) -> RecommendationGraphState:
        return {
            **state,
            "workflow": (*state["workflow"], "filter_constraints"),
        }

    def rank_candidates(state: RecommendationGraphState) -> RecommendationGraphState:
        return {
            **state,
            "restaurants": rank_restaurants(state["request"], state["candidates"]),
            "workflow": (*state["workflow"], "rank_candidates"),
        }

    def validate_recommendations(state: RecommendationGraphState) -> RecommendationGraphState:
        return {
            **state,
            "workflow": (*state["workflow"], "validate_recommendations"),
        }

    builder = StateGraph(RecommendationGraphState)
    builder.add_node("interpret_preferences", interpret_preferences)
    builder.add_node("retrieve_restaurants", retrieve_restaurants)
    builder.add_node("filter_constraints", filter_constraints)
    builder.add_node("rank_candidates", rank_candidates)
    builder.add_node("validate_recommendations", validate_recommendations)
    builder.add_edge(START, "interpret_preferences")
    builder.add_edge("interpret_preferences", "retrieve_restaurants")
    builder.add_edge("retrieve_restaurants", "filter_constraints")
    builder.add_edge("filter_constraints", "rank_candidates")
    builder.add_edge("rank_candidates", "validate_recommendations")
    builder.add_edge("validate_recommendations", END)
    return builder.compile()
