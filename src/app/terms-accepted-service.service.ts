import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TermsAcceptedServiceService {

  constructor() { }

  public termsAccepted(): boolean {
    return localStorage.getItem("soundmarker_accept_terms") === "true";
  }
}
