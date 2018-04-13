/**
 * Import required angular core functions.
 */
import { Injectable } from '@angular/core';

/**
 * Import environment variable Object.
 */
import { environment } from '../../../environments/environment';

/**
 * Configuration class with common variable which are use in application.
 */
@Injectable()
export class Configuration {

    /**
     * The Server - Assign environment API server value.
     */
    public Server = environment.envAPIServer;

    /**
     * The ApiUrl - Assign environment addition API URL content value.
     */
    public ApiUrl = environment.envAPIurl;

    /**
     * The ServerWithApiUrl - Combination of Server API URL and Addition Server API URL content.
     */
    public ServerWithApiUrl = this.Server + this.ApiUrl;

}