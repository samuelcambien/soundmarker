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

  public getEmailFrom(): string {
    return localStorage.getItem("smrk_from");
  }

  public storeExpiration(expiration: string): void {
    localStorage.setItem("smrk_exp",  expiration);
  }

  public getExpiration(): string {
    return localStorage.getItem("smrk_exp");
  }

  public storeAvailability(availability: boolean): void {
    localStorage.setItem("smrk_downl", availability ? "true" : "false");
  }

  public getAvailability(): boolean {
    return localStorage.getItem("smrk_downl") != null ? localStorage.getItem("smrk_downl") === "true" : null;
  }

  public storeNotificationType(notificationType: boolean): void {
    localStorage.setItem("smrk_nfyID",  notificationType? "true" : "false")
  }

  public getNotificationType(): boolean {
    return localStorage.getItem("smrk_nfyID") != null ? localStorage.getItem("smrk_nfyID") === "true" : null;
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
