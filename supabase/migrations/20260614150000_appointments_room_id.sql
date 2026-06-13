-- plugin-appointments-room: 予約への部屋参照（nullable FK）

alter table public.appointments
    add column room_id bigint;

alter table public.appointments
    add constraint appointments_room_id_fkey
        foreign key (room_id) references public.rooms (id) on delete set null;
