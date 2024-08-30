import {
  hasWebBridge, hasSGJavaScriptBridge, HttpRequest, logger,
} from '@shopgate/engage/core';

/**
 * Retrieves a redirect url from a Movable Ink link url
 * @param {string} linkUrl The link url
 * @param {string} [mockRedirectUrl] An optional mocked redirect url that's returned in development
 * environment since redirect url resolution is only possible inside the app
 * @returns {Promise<string|null>}
 */
export const getRedirectUrl = async (linkUrl, mockRedirectUrl) => {
  /**
   * No support for redirect url resolution in website mode
   */
  if (hasWebBridge()) {
    logger.warn('Movable Ink links not supported in website mode');
    return null;
  }

  /**
   * Return the mock url in development environment when PWA runs inside a browser
   */
  if (!hasSGJavaScriptBridge()) {
    return mockRedirectUrl || null;
  }

  /**
   * Dispatch the request with the HttpRequest command which doesn't have the fetch API restrictions
   * that disallow us to access redirect headers.
   */
  const response = await new HttpRequest(linkUrl)
    .setMethod('GET')
    .setFollowRedirects(false)
    .dispatch();

  return response?.headers?.Location || response?.headers?.location || null;
};
