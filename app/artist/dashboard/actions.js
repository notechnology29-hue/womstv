// app/artist/dashboard/actions.js
"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function signout() {
  if (!supabase) {
    redirect("/login");
  }

  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.error("Sign out error:", error);
  }
  
  revalidatePath("/", "layout");
  redirect("/login");
}