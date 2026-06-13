/**
 * 会員 Show（カルテハブ付き）。
 * コア ContactShow の複製 + KarteHubPanel 差し込み。上流変更時は手動マージが必要。
 */
import { useState } from "react";
import {
  InfiniteListBase,
  RecordRepresentation,
  ShowBase,
  useShowContext,
  useTranslate,
} from "ra-core";
import type { ShowBaseProps } from "ra-core";
import { useIsMobile } from "@/hooks/use-mobile";
import { ReferenceField } from "@/components/admin/reference-field";
import { TextField } from "@/components/admin/text-field";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Pencil } from "lucide-react";
import { Link } from "react-router";

import MobileHeader from "@/components/atomic-crm/layout/MobileHeader";
import { MobileContent } from "@/components/atomic-crm/layout/MobileContent";
import { CompanyAvatar } from "@/components/atomic-crm/companies/CompanyAvatar";
import {
  NoteCreate,
  NotesIterator,
  NotesIteratorMobile,
} from "@/components/atomic-crm/notes";
import { NoteCreateSheet } from "@/components/atomic-crm/notes/NoteCreateSheet";
import { TagsListEdit } from "@/components/atomic-crm/contacts/TagsListEdit";
import { ContactEditSheet } from "@/components/atomic-crm/contacts/ContactEditSheet";
import { ContactStatusSelector } from "@/components/atomic-crm/contacts/ContactInputs";
import { ContactPersonalInfo } from "@/components/atomic-crm/contacts/ContactPersonalInfo";
import { ContactBackgroundInfo } from "@/components/atomic-crm/contacts/ContactBackgroundInfo";
import { ContactTasksList } from "@/components/atomic-crm/contacts/ContactTasksList";
import type { Contact } from "@/components/atomic-crm/types";
import { Avatar } from "@/components/atomic-crm/contacts/Avatar";
import { ContactAside } from "@/components/atomic-crm/contacts/ContactAside";
import { MobileBackButton } from "@/components/atomic-crm/misc/MobileBackButton";

import { KarteHubPanel } from "./KarteHubPanel";

export const ContactShowWithKarte = (props: ShowBaseProps = {}) => {
  const isMobile = useIsMobile();

  return (
    <ShowBase
      queryOptions={{
        onError: isMobile
          ? () => {
              {
                /** Disable error notification as the content handles offline */
              }
            }
          : undefined,
      }}
      {...props}
    >
      {isMobile ? <ContactShowContentMobile /> : <ContactShowContent />}
    </ShowBase>
  );
};

const ContactShowContentMobile = () => {
  const translate = useTranslate();
  const { defaultTitle, record, isPending } = useShowContext<Contact>();
  const [noteCreateOpen, setNoteCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  if (isPending || !record) return null;

  const taskCount = record.nb_tasks ?? 0;

  return (
    <>
      {/* We need to repeat the note creation sheet here to support the note 
      create button that is rendered when there are no notes. */}
      <NoteCreateSheet
        open={noteCreateOpen}
        onOpenChange={setNoteCreateOpen}
        contact_id={record.id}
      />
      <ContactEditSheet
        open={editOpen}
        onOpenChange={setEditOpen}
        contactId={record.id}
      />
      <MobileHeader>
        <MobileBackButton />
        <div className="flex flex-1 min-w-0">
          <Link to="/contacts" className="flex-1 min-w-0">
            <h1 className="truncate text-xl font-semibold">{defaultTitle}</h1>
          </Link>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-full"
          aria-label={translate("ra.action.edit")}
          onClick={() => setEditOpen(true)}
        >
          <Pencil className="size-5" />
        </Button>
      </MobileHeader>
      <MobileContent>
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <Avatar />
            <div className="mx-3 flex-1">
              <h2 className="text-2xl font-bold">
                <RecordRepresentation />
              </h2>
              <div className="text-sm text-muted-foreground">
                {record.title && record.company_id != null
                  ? `${translate("resources.contacts.position_at", {
                      title: record.title,
                    })} `
                  : record.title}
                {record.company_id != null && (
                  <ReferenceField
                    source="company_id"
                    reference="companies"
                    link="show"
                  >
                    <TextField source="name" className="underline" />
                  </ReferenceField>
                )}
              </div>
            </div>
            <div>
              <ReferenceField
                source="company_id"
                reference="companies"
                link="show"
                className="no-underline"
              >
                <CompanyAvatar />
              </ReferenceField>
            </div>
          </div>
        </div>

        <Tabs defaultValue="notes" className="w-full">
          <TabsList className="grid w-full grid-cols-4 h-10">
            <TabsTrigger value="notes">
              {translate("resources.notes.name", { smart_count: 2 })}
            </TabsTrigger>
            <TabsTrigger value="karte">
              {translate("custom.karte.title")}
            </TabsTrigger>
            <TabsTrigger value="tasks">
              {translate("crm.common.task_count", {
                smart_count: taskCount ?? 0,
              })}
            </TabsTrigger>
            <TabsTrigger value="details">
              {translate("crm.common.details")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notes" className="mt-2">
            <InfiniteListBase
              resource="contact_notes"
              filter={{ contact_id: record.id }}
              sort={{ field: "date", order: "DESC" }}
              perPage={25}
              disableSyncWithLocation
              storeKey={false}
              empty={
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-muted-foreground mb-4">
                    {translate("resources.notes.empty")}
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setNoteCreateOpen(true)}
                  >
                    {translate("resources.notes.action.add")}
                  </Button>
                </div>
              }
              loading={false}
              error={false}
              queryOptions={{
                onError: () => {
                  /** override to hide notification as error case is handled by NotesIteratorMobile */
                },
              }}
            >
              <NotesIteratorMobile contactId={record.id} showStatus />
            </InfiniteListBase>
          </TabsContent>

          <TabsContent value="karte" className="mt-4">
            <KarteHubPanel />
          </TabsContent>

          <TabsContent value="tasks" className="mt-4">
            <ContactTasksList />
          </TabsContent>

          <TabsContent value="details" className="mt-4">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold">
                  {translate("resources.notes.fields.status")}
                </h3>
                <Separator />
                <div className="mt-3">
                  <ContactStatusSelector />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  {translate(
                    "resources.contacts.field_categories.personal_info",
                  )}
                </h3>
                <Separator />
                <div className="mt-3">
                  <ContactPersonalInfo />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  {translate(
                    "resources.contacts.field_categories.background_info",
                  )}
                </h3>
                <Separator />
                <div className="mt-3">
                  <ContactBackgroundInfo />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  {translate("resources.tags.name", { smart_count: 2 })}
                </h3>
                <Separator />
                <div className="mt-3">
                  <TagsListEdit />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </MobileContent>
    </>
  );
};

const ContactShowContent = () => {
  const translate = useTranslate();
  const { record, isPending } = useShowContext<Contact>();
  if (isPending || !record) return null;

  return (
    <div className="mt-2 mb-2 flex gap-8">
      <div className="flex-1 flex flex-col gap-4">
        <Card>
          <CardContent>
            <div className="flex">
              <Avatar />
              <div className="ml-2 flex-1">
                <h5 className="text-xl font-semibold">
                  <RecordRepresentation />
                </h5>
                <div className="inline-flex text-sm text-muted-foreground">
                  {record.title && record.company_id != null
                    ? `${translate("resources.contacts.position_at", {
                        title: record.title,
                      })} `
                    : record.title}
                  {record.company_id != null && (
                    <ReferenceField
                      source="company_id"
                      reference="companies"
                      link="show"
                    >
                      &nbsp;
                      <TextField source="name" />
                    </ReferenceField>
                  )}
                </div>
              </div>
              <div>
                <ReferenceField
                  source="company_id"
                  reference="companies"
                  link="show"
                  className="no-underline"
                >
                  <CompanyAvatar />
                </ReferenceField>
              </div>
            </div>
            <InfiniteListBase
              resource="contact_notes"
              filter={{ contact_id: record.id }}
              sort={{ field: "date", order: "DESC" }}
              perPage={25}
              disableSyncWithLocation
              storeKey={false}
              empty={
                <NoteCreate reference="contacts" showStatus className="mt-4" />
              }
            >
              <NotesIterator reference="contacts" showStatus />
            </InfiniteListBase>
          </CardContent>
        </Card>
        <KarteHubPanel />
      </div>
      <ContactAside />
    </div>
  );
};
