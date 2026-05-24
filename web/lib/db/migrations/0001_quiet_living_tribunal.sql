CREATE TABLE "barber_services" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"barber_id" uuid NOT NULL,
	"service_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "locations" ADD COLUMN "city" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "locations" ADD COLUMN "street" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "locations" ADD COLUMN "lat" real;--> statement-breakpoint
ALTER TABLE "locations" ADD COLUMN "lng" real;--> statement-breakpoint
ALTER TABLE "barber_services" ADD CONSTRAINT "barber_services_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "barber_services" ADD CONSTRAINT "barber_services_barber_id_barbers_id_fk" FOREIGN KEY ("barber_id") REFERENCES "public"."barbers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "barber_services" ADD CONSTRAINT "barber_services_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "barber_services_org_idx" ON "barber_services" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "barber_services_barber_idx" ON "barber_services" USING btree ("barber_id");