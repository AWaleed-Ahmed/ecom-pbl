import { runCppProgram } from "../utils/cppHelper.js";

export const getRecommendations = async (req, res) => {
  try {
    const productId = req.params.productId;

    const output = await runCppProgram(["get-recommendations", productId]);

    // Parse output: "Recommendations: 5 10 15"
    const match = output.match(/Recommendations:\s*(.+)/);

    if (!match || !match[1].trim()) {
      return res.json({ recommendations: [] });
    }

    const ids = match[1]
      .trim()
      .split(/\s+/)
      .filter((id) => id && !isNaN(id))
      .map((id) => parseInt(id));

    res.json({ recommendations: ids });
  } catch (error) {
    console.error("Error getting recommendations:", error);
    res.status(500).json({ error: "Failed to get recommendations" });
  }
};
