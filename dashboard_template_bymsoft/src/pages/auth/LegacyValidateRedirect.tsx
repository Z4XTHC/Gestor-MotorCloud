import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const LegacyValidateRedirect = () => {
  const navigate = useNavigate();
  const { search } = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(search);
    const id = params.get("id");
    const token = params.get("token");
    if (!id) {
      // No id provided — go home or show 404 handled by routes
      navigate("/error-404", { replace: true });
      return;
    }
    const q = token ? `?token=${encodeURIComponent(token)}` : "";
    navigate(`/activation/${encodeURIComponent(id)}${q}`, { replace: true });
  }, [search, navigate]);

  return null;
};

export default LegacyValidateRedirect;
