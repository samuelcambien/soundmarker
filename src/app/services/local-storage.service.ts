import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  public acceptTerms(date: Date): void {
    localStorage.setItem("smrk_consent", date.toDateString());
  }

  public termsAccepted(): boolean {
    return localStorage.getItem("smrk_consent") != null;
  }

  public storeEmailFrom(emailFrom: string): void {
    localStorage.setItem("smrk_from", emailFrom);
  }

  public storeNotifyID(notifyID: string):void{
    localStorage.setItem("smrk_nfyID",  notifyID)
  }

  public getEmailFrom(): string {
    return localStorage.getItem("smrk_from") != null ? localStorage.getItem("smrk_from") : "";
  }

  public storeShareMode(shareMode: string): void {
    localStorage.setItem("smrk_type", shareMode);
  }

  public getShareMode(): string {
    return localStorage.getItem("smrk_type") != null ? localStorage.getItem("smrk_type") : "";
  }

  public storePeriod(period: string): void {
    localStorage.setItem("smrk_period", period);
  }

  public getPeriod(): string {
    return localStorage.getItem("smrk_period") != null ? localStorage.getItem("smrk_period") : "";
  }

  public storeAllowDownloads(allowDownloads: boolean): void {
    localStorage.setItem("smrk_downl", allowDownloads ? "true" : "false");
  }

  public getAllowDownloads(): boolean {
    return localStorage.getItem("smrk_downl") === "true";
  }

  public getNotificationID(): string {
    return localStorage.getItem("smrk_nfyID") != null ? localStorage.getItem("smrk_nfyID") : "2";
  }

  public storeCommentName(commentName: string): void {
    localStorage.setItem("smrk_comment_name", commentName);
  }

  public getCommentName(): string {
    return localStorage.getItem("smrk_comment_name") != null ? localStorage.getItem("smrk_comment_name") : "";
  }

  public storeVisit(): void {
    localStorage.setItem("smrk_visit", (this.getVisits() + 1) + "");
  }

  public getVisits(): number {
    return localStorage.getItem("smrk_visit") != null ?
      Number(localStorage.getItem("smrk_visit")) : 0;
  }
}
