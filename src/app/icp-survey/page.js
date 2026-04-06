"use client";

import { FormRunner } from "@/components/FormRunner";
import { ICP_SURVEY } from "@/lib/forms/icp-survey";

export default function ICPSurveyPage() {
  return <FormRunner config={ICP_SURVEY} />;
}
