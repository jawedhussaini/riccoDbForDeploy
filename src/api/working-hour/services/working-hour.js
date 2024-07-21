'use strict';

/**
 * working-hour service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::working-hour.working-hour');
