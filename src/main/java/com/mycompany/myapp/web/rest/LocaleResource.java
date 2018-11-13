package com.mycompany.myapp.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.mycompany.myapp.domain.Locale;
import com.mycompany.myapp.repository.LocaleRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import com.mycompany.myapp.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing Locale.
 */
@RestController
@RequestMapping("/api")
public class LocaleResource {

    private final Logger log = LoggerFactory.getLogger(LocaleResource.class);

    private static final String ENTITY_NAME = "locale";

    private final LocaleRepository localeRepository;

    public LocaleResource(LocaleRepository localeRepository) {
        this.localeRepository = localeRepository;
    }

    /**
     * POST  /locales : Create a new locale.
     *
     * @param locale the locale to create
     * @return the ResponseEntity with status 201 (Created) and with body the new locale, or with status 400 (Bad Request) if the locale has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/locales")
    @Timed
    public ResponseEntity<Locale> createLocale(@RequestBody Locale locale) throws URISyntaxException {
        log.debug("REST request to save Locale : {}", locale);
        if (locale.getId() != null) {
            throw new BadRequestAlertException("A new locale cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Locale result = localeRepository.save(locale);
        return ResponseEntity.created(new URI("/api/locales/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /locales : Updates an existing locale.
     *
     * @param locale the locale to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated locale,
     * or with status 400 (Bad Request) if the locale is not valid,
     * or with status 500 (Internal Server Error) if the locale couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/locales")
    @Timed
    public ResponseEntity<Locale> updateLocale(@RequestBody Locale locale) throws URISyntaxException {
        log.debug("REST request to update Locale : {}", locale);
        if (locale.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Locale result = localeRepository.save(locale);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, locale.getId().toString()))
            .body(result);
    }

    /**
     * GET  /locales : get all the locales.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of locales in body
     */
    @GetMapping("/locales")
    @Timed
    public List<Locale> getAllLocales() {
        log.debug("REST request to get all Locales");
        return localeRepository.findAll();
    }

    /**
     * GET  /locales/:id : get the "id" locale.
     *
     * @param id the id of the locale to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the locale, or with status 404 (Not Found)
     */
    @GetMapping("/locales/{id}")
    @Timed
    public ResponseEntity<Locale> getLocale(@PathVariable Long id) {
        log.debug("REST request to get Locale : {}", id);
        Optional<Locale> locale = localeRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(locale);
    }

    /**
     * DELETE  /locales/:id : delete the "id" locale.
     *
     * @param id the id of the locale to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/locales/{id}")
    @Timed
    public ResponseEntity<Void> deleteLocale(@PathVariable Long id) {
        log.debug("REST request to delete Locale : {}", id);

        localeRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
