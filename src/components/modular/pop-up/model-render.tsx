"use client";

import { useEffect, useMemo, useState } from "react";
import { ButtonPrimary, ButtonSecondary } from "@/components/modular/button";
import { api } from "@/lib/api";

type Gender = "male" | "female";

type MeasurementField = {
  key: string;
  label: string;
  type: "text" | "number" | "select";
  placeholder: string;
};

type MaleMeasurements = {
  height: number;
  body_type:
    | "SLIM"
    | "REGULAR"
    | "ATHLETIC"
    | "MUSCULAR"
    | "BROAD"
    | "HEAVYSET";
  shoulder_width: number;
  chest: number;
  waist: number;
  belly: number;
  hips: number;
  pant_waist: number;
  thigh: number;
};

type FemaleMeasurements = {
  height: number;
  body_shape:
    | "HOURGLASS"
    | "PEAR"
    | "APPLE"
    | "RECTANGLE"
    | "INVERTED_TRIANGLE";
  shoulder_width: number;
  bust: number;
  underbust: number;
  waist: number;
  hips: number;
  pant_waist: number;
  thigh: number;
};

export type ModelDataType = {
  model_id: string;
  name: string;
  gender: Gender;
  image_url: string;
  measurements: MaleMeasurements | FemaleMeasurements;
};

type ModelRenderPopUpProps = {
  data: ModelDataType;
  onClose: () => void;
};

const bodyTypeOptions = [
  "SLIM",
  "REGULAR",
  "ATHLETIC",
  "MUSCULAR",
  "BROAD",
  "HEAVYSET",
];

const bodyShapeOptions = [
  "HOURGLASS",
  "PEAR",
  "APPLE",
  "RECTANGLE",
  "INVERTED_TRIANGLE",
];

const maleMeasurementFields: MeasurementField[] = [
  { key: "height", label: "Height", type: "number", placeholder: "175" },
  {
    key: "body_type",
    label: "Body Type",
    type: "select",
    placeholder: "Select body type",
  },
  {
    key: "shoulder_width",
    label: "Shoulder Width",
    type: "number",
    placeholder: "42",
  },
  { key: "chest", label: "Chest", type: "number", placeholder: "95" },
  { key: "waist", label: "Waist", type: "number", placeholder: "80" },
  { key: "belly", label: "Belly", type: "number", placeholder: "88" },
  { key: "hips", label: "Hips", type: "number", placeholder: "95" },
  { key: "pant_waist", label: "Pant Waist", type: "number", placeholder: "82" },
  { key: "thigh", label: "Thigh", type: "number", placeholder: "55" },
];

const femaleMeasurementFields: MeasurementField[] = [
  { key: "height", label: "Height", type: "number", placeholder: "165" },
  {
    key: "body_shape",
    label: "Body Shape",
    type: "select",
    placeholder: "Select body shape",
  },
  {
    key: "shoulder_width",
    label: "Shoulder Width",
    type: "number",
    placeholder: "38",
  },
  { key: "bust", label: "Bust", type: "number", placeholder: "90" },
  { key: "underbust", label: "Underbust", type: "number", placeholder: "75" },
  { key: "waist", label: "Waist", type: "number", placeholder: "70" },
  { key: "hips", label: "Hips", type: "number", placeholder: "95" },
  { key: "pant_waist", label: "Pant Waist", type: "number", placeholder: "78" },
  { key: "thigh", label: "Thigh", type: "number", placeholder: "52" },
];

const buildMeasurementState = (
  gender: Gender,
  measurements: MaleMeasurements | FemaleMeasurements,
) => {
  const baseState =
    gender === "male"
      ? {
          height: "",
          body_type: "",
          shoulder_width: "",
          chest: "",
          waist: "",
          belly: "",
          hips: "",
          pant_waist: "",
          thigh: "",
        }
      : {
          height: "",
          body_shape: "",
          shoulder_width: "",
          bust: "",
          underbust: "",
          waist: "",
          hips: "",
          pant_waist: "",
          thigh: "",
        };

  return Object.fromEntries(
    Object.entries(baseState).map(([key, value]) => [
      key,
      measurements?.[key as keyof typeof measurements] == null
        ? value
        : String(measurements[key as keyof typeof measurements]),
    ]),
  ) as Record<string, string>;
};

type InitialModelState = {
  name: string;
  gender: Gender;
  maleMeasurements: Record<string, string>;
  femaleMeasurements: Record<string, string>;
};

const buildInitialState = (modelData: ModelDataType): InitialModelState => ({
  name: modelData.name,
  gender: modelData.gender,
  maleMeasurements: buildMeasurementState("male", modelData.measurements),
  femaleMeasurements: buildMeasurementState("female", modelData.measurements),
});

export const ModelRenderPopUp = ({ data, onClose }: ModelRenderPopUpProps) => {
  const [name, setName] = useState(data.name);
  const [gender, setGender] = useState<Gender>(data.gender);
  const [maleMeasurements, setMaleMeasurements] = useState<
    Record<string, string>
  >(() => buildMeasurementState("male", data.measurements));
  const [femaleMeasurements, setFemaleMeasurements] = useState<
    Record<string, string>
  >(() => buildMeasurementState("female", data.measurements));
  const [initialState, setInitialState] = useState<InitialModelState>(() =>
    buildInitialState(data),
  );
  const [isSaving, setIsSaving] = useState(false);

  const measurementFields =
    gender === "male" ? maleMeasurementFields : femaleMeasurementFields;
  const currentMeasurements =
    gender === "male" ? maleMeasurements : femaleMeasurements;

  const isFormComplete = useMemo(() => {
    return (
      Boolean(name.trim()) &&
      measurementFields.every((field) =>
        Boolean(currentMeasurements[field.key]?.toString().trim()),
      )
    );
  }, [currentMeasurements, measurementFields, name]);

  const hasChanges = useMemo(() => {
    const initialMeasurements =
      initialState.gender === "male"
        ? initialState.maleMeasurements
        : initialState.femaleMeasurements;

    const currentFormState = {
      name,
      gender,
      measurements: currentMeasurements,
    };

    const initialFormState = {
      name: initialState.name,
      gender: initialState.gender,
      measurements: initialMeasurements,
    };

    return (
      JSON.stringify(currentFormState) !== JSON.stringify(initialFormState)
    );
  }, [currentMeasurements, gender, initialState, name]);

  const handleMeasurementChange = (key: string, value: string) => {
    if (gender === "male") {
      setMaleMeasurements((prev) => ({ ...prev, [key]: value }));
    } else {
      setFemaleMeasurements((prev) => ({ ...prev, [key]: value }));
    }
  };

  const buildMeasurementPayload = (values: Record<string, string>) => {
    return Object.fromEntries(
      Object.entries(values).map(([key, value]) => {
        if (key === "body_type" || key === "body_shape") {
          return [key, value];
        }

        const numericValue = Number(value);
        return [key, Number.isNaN(numericValue) ? value : numericValue];
      }),
    );
  };

  const handleSave = async () => {
    if (!hasChanges || !isFormComplete || isSaving) return;

    setIsSaving(true);

    try {
      const payload = {
        model_id: data.model_id,
        gender,
        measurements: buildMeasurementPayload(currentMeasurements),
      };

      const response = await api.put("/api/model/update", payload);

      if (response.status === 200) {
        onClose();
      }
    } catch (error) {
      console.error("Unexpected error while updating the model", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/model/${data.model_id}`);
      onClose();
    } catch (e) {
      console.log("Unexpected error occured deleting user model as: ", e);
    }
  };

  useEffect(() => {
    const nextState = buildInitialState(data);
    setInitialState(nextState);
    setName(nextState.name);
    setGender(nextState.gender);
    setMaleMeasurements(nextState.maleMeasurements);
    setFemaleMeasurements(nextState.femaleMeasurements);
  }, [data]);

  return (
    <div className="flex h-full w-full flex-col items-center gap-4 sm:flex-row sm:items-start sm:justify-start">
      <div className="flex w-full flex-col items-start justify-start gap-2 sm:w-1/3">
        <div className="relative w-full overflow-hidden rounded-2xl bg-black shadow-lg">
          <div className="aspect-[2/3] w-full">
            <img
              src={data.image_url}
              alt={name || data.name}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="flex h-full w-full flex-col items-start justify-start gap-4 sm:w-2/3">
        <div className="flex w-full flex-col items-start justify-start gap-2 overflow-auto">
          <div className="w-full">
            <label className="mb-1 block text-sm font-medium text-contrast">
              Name
            </label>
            <input
              type="text"
              className="w-full border border-border bg-background-primary p-2 text-text placeholder:text-text/50 focus:outline-none focus:ring-1 focus:ring-accent"
              placeholder="Model name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="w-full">
            <label className="mb-1 block text-sm font-medium text-contrast">
              Gender
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as Gender)}
              className="w-full border border-border bg-background-primary p-2 text-text focus:outline-none focus:ring-1 focus:ring-accent"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div className="w-full">
            <div className="mt-2 mb-2 flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-contrast">
                Body Measurements (cm)
              </h3>
              <span className="text-xs text-text/60">
                {gender === "male" ? "Male" : "Female"}
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {measurementFields.map((field) => (
                <div key={field.key} className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-contrast">
                    {field.label}
                  </label>
                  {field.type === "select" ? (
                    <select
                      value={currentMeasurements[field.key] ?? ""}
                      onChange={(e) =>
                        handleMeasurementChange(field.key, e.target.value)
                      }
                      className="w-full border border-border bg-background-primary p-2 text-text focus:outline-none focus:ring-1 focus:ring-accent"
                    >
                      <option value="">{field.placeholder}</option>
                      {(field.key === "body_type"
                        ? bodyTypeOptions
                        : bodyShapeOptions
                      ).map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      step="0.1"
                      min="0"
                      value={currentMeasurements[field.key] ?? ""}
                      onChange={(e) =>
                        handleMeasurementChange(field.key, e.target.value)
                      }
                      placeholder={field.placeholder}
                      className="w-full border border-border bg-background-primary p-2 text-text placeholder:text-text/50 focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 flex w-full justify-end gap-2">
              <ButtonPrimary
                text={isSaving ? "Saving..." : "Update"}
                onClick={handleSave}
                buttonClass={
                  hasChanges && isFormComplete && !isSaving
                    ? ""
                    : "pointer-events-none opacity-50"
                }
              />
              <ButtonSecondary text="Delete" onClick={handleDelete} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
