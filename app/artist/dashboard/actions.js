// app/artist/dashboard/actions.js
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function signout() {
  const supabase = await createClient();

  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.error("Sign out error:", error);
  }
  
  revalidatePath("/", "layout");
  redirect("/login");
}