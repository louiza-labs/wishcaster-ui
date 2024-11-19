export function generateAiInsight(): string {
  const insights = [
    "Launch a limited edition vegan product line with eco-friendly packaging to address two major customer concerns. Potential impact: 35% increase in customer satisfaction.",
    "Initiate a social media campaign for followers to vote on new color options. Potential impact: 50% boost in social media interactions, 20% increase in sales for new colors.",
    "Develop a sustainability initiative focusing on eco-friendly packaging. Potential impact: 15% increase in brand loyalty, 10% reduction in customer churn rate.",
    "Implement a dynamic pricing strategy with targeted discounts or bundle deals. Potential impact: 25% increase in conversion rates, improved overall customer lifetime value.",
  ]
  return insights[Math.floor(Math.random() * insights.length)]
}
