export interface ErrorDto {
  id?: string;
  event_id?: string;
  event_version?: string;
  event_name?: string;
  event_time?: string;
  producer?: string;
  message: string;
}
