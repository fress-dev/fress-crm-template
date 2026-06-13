import { test, expect } from "./fixtures";
import { ja } from "./ja";
import { resolveServiceRoleKey, resolveSupabaseUrl } from "./resolveE2eEnv";
import { createClient } from "@supabase/supabase-js";

test("session log from appointment consumes ticket", async ({
  page,
  createSales,
  createStore,
  createCourse,
  createContact,
  createMembership,
  dismissToast,
}) => {
  const sales = await createSales({
    first_name: "セッション",
    last_name: "担当",
    email: "session-log-admin@example.com",
    password: "password",
  });
  const store = await createStore({ name: "E2E セッション店舗" });
  const course = await createCourse({ name: "E2E セッション 4回" });
  const contact = await createContact({
    first_name: "花子",
    last_name: "セッション会員",
    sales_id: sales.id,
    store_id: store.id,
  });
  await createMembership({
    contact_id: contact.id,
    course_id: course.id,
    store_id: store.id,
    ticket_count: 2,
  });

  const admin = createClient(resolveSupabaseUrl(), resolveServiceRoleKey(), {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const start = new Date();
  start.setHours(14, 0, 0, 0);
  const end = new Date(start);
  end.setHours(15, 0, 0, 0);

  const { data: appointment, error: appointmentError } = await admin
    .from("appointments")
    .insert({
      contact_id: contact.id,
      sales_id: sales.id,
      store_id: store.id,
      start_at: start.toISOString(),
      end_at: end.toISOString(),
      type: "session",
      title: "E2E セッション予約",
    })
    .select("id")
    .single();

  if (appointmentError || !appointment) {
    throw new Error(
      `Failed to create appointment: ${appointmentError?.message}`,
    );
  }

  const { data: ticketsBefore } = await admin
    .from("membership_tickets")
    .select("id, status, ticket_number")
    .eq("contact_id", contact.id)
    .order("ticket_number", { ascending: true });

  const availableTicket = ticketsBefore?.find(
    (ticket) => ticket.status === "available",
  );
  expect(availableTicket).toBeTruthy();

  await page.goto("http://localhost:5175/");
  await page.getByLabel(ja.email).fill("session-log-admin@example.com");
  await page.getByLabel(ja.password).fill("password");
  await page.getByRole("button", { name: ja.signIn }).click();
  await page.waitForLoadState("networkidle");

  await page.goto(
    `http://localhost:5175/#/session_logs/create?appointment_id=${appointment.id}`,
  );
  await page.waitForLoadState("networkidle");

  await page.getByLabel("消費チケット").click();
  await page
    .getByRole("option", { name: `#${availableTicket!.ticket_number}` })
    .click();
  await page.getByLabel("体重 (kg)").fill("62.5");
  await page.getByLabel("コメント").fill("E2E セッション記録");

  await page.getByRole("button", { name: "セッション記録を登録" }).click();
  await dismissToast(ja.createdToast);

  await page.waitForURL(/#\/session_logs\/\d+\/show/);

  await expect(page.getByText("E2E セッション記録")).toBeVisible();
  await expect(page.getByText("62.5")).toBeVisible();

  const { data: ticketsAfter } = await admin
    .from("membership_tickets")
    .select("id, status")
    .eq("id", availableTicket!.id)
    .single();

  expect(ticketsAfter?.status).toBe("used");

  await page.goto("http://localhost:5175/#/session_logs");
  await page.waitForLoadState("networkidle");
  await expect(
    page.getByRole("cell", { name: "セッション会員" }),
  ).toBeVisible();

  await page.getByPlaceholder(ja.search).fill("E2E セッション");
  await page.waitForLoadState("networkidle");
  await expect(
    page.getByRole("cell", { name: "E2E セッション記録" }),
  ).toBeVisible();
});
