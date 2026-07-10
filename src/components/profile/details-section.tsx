"use client";
import { useState } from "react";
import { Users, Mail, BadgeCheck, Building2, MapPin } from "lucide-react";
import { useAuth } from "@/app/providers/auth";
import { Separator } from "@/components/ui/separator";
import { ButtonPrimary, ButtonSecondary } from "../modular/button";
import { api } from "@/lib/api";

export const DetailsSection = () => {
  const [editing, setEditing] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [accType, setAccType] = useState<string>("");
  const [bussinessName, setBussinessName] = useState<string>("");
  const [bussinessAddress, setBussinessAddress] = useState<string>("");
  const { user, refreshUser } = useAuth();

  const onClickOfEdit = () => {
    setName(user?.name || "");
    setAccType(user?.type_of_user || "");
    setBussinessName(user?.bussiness_name || "");
    setBussinessAddress(user?.bussiness_address || "");
    setEditing(true);
  };

  const onChangeOfAccType = (type: string) => {
    if (type == "independent") {
      setBussinessName("");
      setBussinessAddress("");
    }
    setAccType(type);
  };

  const onUpdateAccountDetails = async () => {
    try {
      const payload: Record<string, string> = {
        name,
        type_of_user: accType,
      };

      if (accType !== "independent") {
        payload.bussiness_name = bussinessName;
        payload.bussiness_address = bussinessAddress;
      }

      await api.post("/api/profile/update", payload);
      setEditing(false);
      await refreshUser();
    } catch (e) {
      console.log("Unexpected error occured updating user details as: ", e);
    }
  };

  const shouldShowBusinessDetails = editing
    ? accType !== "independent"
    : user?.type_of_user !== "independent";

  return (
    <div className="flex w-full flex-col items-start justify-start">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl text-contrast font-semibold pb-2">Details</h1>
        {editing ? (
          <ButtonSecondary text="Update" onClick={onUpdateAccountDetails} />
        ) : (
          <ButtonPrimary text="Edit" onClick={() => onClickOfEdit()} />
        )}
      </div>
      <Separator className="w-full bg-accent" />
      {/* name */}
      <div className="flex w-full flex-col gap-2 py-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="flex items-center gap-3 text-text/70">
          <Users size={18} className="text-accent" />
          <span className="text-xs font-medium tracking-[0.22em] uppercase">
            Full Name
          </span>
        </div>
        {editing ? (
          <input
            type="text"
            className="w-[1/2] h-auto bg-contrast text-background-primary outline-none focus:outline-none focus:ring-0 focus:border-none pl-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        ) : (
          <p className="text-base font-medium text-contrast sm:max-w-[60%] sm:text-right">
            {user?.name}
          </p>
        )}
      </div>

      {/* email */}
      <div className="flex w-full flex-col gap-2 py-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="flex items-center gap-3 text-text/70">
          <Mail size={18} className="text-accent" />
          <span className="text-xs font-medium tracking-[0.22em] uppercase">
            Email
          </span>
        </div>
        <p className="text-base font-medium break-all text-contrast sm:max-w-[60%] sm:text-right">
          {user?.email}
        </p>
      </div>

      {/* acc type */}
      <div className="flex w-full flex-col gap-2 py-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="flex items-center gap-3 text-text/70">
          <BadgeCheck size={18} className="text-accent" />
          <span className="text-xs font-medium tracking-[0.22em] uppercase">
            Account Type
          </span>
        </div>
        {editing ? (
          <select
            value={accType}
            onChange={(e) => onChangeOfAccType(e.target.value)}
            className="w-[1/2] bg-background-primary text-text focus:outline-none"
          >
            <option value={"independent"}>Independent</option>
            <option value={"tailor"}>Tailor</option>
            <option value={"store"}>Store</option>
          </select>
        ) : (
          <p className="text-base font-medium text-contrast capitalize sm:max-w-[60%] sm:text-right">
            {user?.type_of_user}
          </p>
        )}
      </div>

      {/* bussiness name */}
      {shouldShowBusinessDetails && (
        <div className="flex w-full flex-col gap-2 py-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
          <div className="flex items-center gap-3 text-text/70">
            <Building2 size={18} className="text-accent" />
            <span className="text-xs font-medium tracking-[0.22em] uppercase">
              Bussiness Name
            </span>
          </div>
          {editing ? (
            <input
              type="text"
              className="w-[1/2] h-auto bg-contrast text-background-primary outline-none focus:outline-none focus:ring-0 focus:border-none pl-2"
              value={bussinessName}
              onChange={(e) => setBussinessName(e.target.value)}
            />
          ) : (
            <p className="text-base font-medium text-contrast capitalize sm:max-w-[60%] sm:text-right">
              {bussinessName || "-"}
            </p>
          )}
        </div>
      )}

      {/* bussiness address */}
      {shouldShowBusinessDetails && (
        <div className="flex w-full flex-col gap-2 py-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
          <div className="flex items-center gap-3 text-text/70">
            <MapPin size={18} className="text-accent" />
            <span className="text-xs font-medium tracking-[0.22em] uppercase">
              Bussiness Address
            </span>
          </div>
          {editing ? (
            <input
              type="text"
              className="w-[1/2] h-auto bg-contrast text-background-primary outline-none focus:outline-none focus:ring-0 focus:border-none pl-2"
              value={bussinessAddress}
              onChange={(e) => setBussinessAddress(e.target.value)}
            />
          ) : (
            <p className="text-base font-medium text-contrast capitalize sm:max-w-[60%] sm:text-right">
              {user?.type_of_user}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
