package br.com.jasees.web.rest;

import br.com.jasees.JaseesApp;
import br.com.jasees.domain.Election;
import br.com.jasees.repository.ElectionRepository;
import br.com.jasees.repository.UserRepository;
import br.com.jasees.service.ElectionService;
import br.com.jasees.web.rest.errors.ExceptionTranslator;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;

import static br.com.jasees.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the ElectionResource REST controller.
 *
 * @see ElectionResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = JaseesApp.class)
public class ElectionResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESC = "AAAAAAAAAAAAAAAAAAAA";
    private static final String UPDATED_DESC = "BBBBBBBBBBBBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_INIT_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_INIT_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_END_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_END_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final HashSet<String> DEFAULT_CAND_LIST = new HashSet<>(Arrays.asList(new String[]{"user-0", "user-1"}));
    private static final HashSet<String> UPDATED_CAND_LIST = new HashSet<>(Arrays.asList(new String[]{"user-0", "user-2"}));;

    @Autowired
    private ElectionRepository electionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private ElectionService electionService;

    private MockMvc restElectionMockMvc;

    private Election election;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        ElectionResource electionResource = new ElectionResource(electionRepository, userRepository, electionService);
        this.restElectionMockMvc = MockMvcBuilders.standaloneSetup(electionResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     * <p>
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Election createEntity() {
        Election election = new Election();
        election.setName(DEFAULT_NAME);
        election.setDesc(DEFAULT_DESC);
        election.setInitDate(DEFAULT_INIT_DATE);
        election.setEndDate(DEFAULT_END_DATE);
        election.setCandList(DEFAULT_CAND_LIST);
        election.init();
        return election;
    }

    @Before
    public void initTest() {
        electionRepository.deleteAll();
        election = createEntity();
    }

    @Test
    public void createElection() throws Exception {
        int databaseSizeBeforeCreate = electionRepository.findAll().size();

        // Create the Election
        restElectionMockMvc.perform(post("/api/elections")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(election)))
            .andExpect(status().isCreated());

        // Validate the Election in the database
        List<Election> electionList = electionRepository.findAll();
        assertThat(electionList).hasSize(databaseSizeBeforeCreate + 1);
        Election testElection = electionList.get(electionList.size() - 1);
        assertThat(testElection.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testElection.getDesc()).isEqualTo(DEFAULT_DESC);
        assertThat(testElection.getInitDate()).isEqualTo(DEFAULT_INIT_DATE);
        assertThat(testElection.getEndDate()).isEqualTo(DEFAULT_END_DATE);
        assertThat(testElection.getCandList()).isEqualTo(DEFAULT_CAND_LIST);
    }

    @Test
    public void createElectionWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = electionRepository.findAll().size();

        // Create the Election with an existing ID
        election.setId("existing_id");

        // An entity with an existing ID cannot be created, so this API call must fail
        restElectionMockMvc.perform(post("/api/elections")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(election)))
            .andExpect(status().isBadRequest());

        // Validate the Alice in the database
        List<Election> electionList = electionRepository.findAll();
        assertThat(electionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = electionRepository.findAll().size();
        // set the field null
        election.setName(null);

        // Create the Election, which fails.

        restElectionMockMvc.perform(post("/api/elections")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(election)))
            .andExpect(status().isBadRequest());

        List<Election> electionList = electionRepository.findAll();
        assertThat(electionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void checkDescIsRequired() throws Exception {
        int databaseSizeBeforeTest = electionRepository.findAll().size();
        // set the field null
        election.setDesc(null);

        // Create the Election, which fails.

        restElectionMockMvc.perform(post("/api/elections")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(election)))
            .andExpect(status().isBadRequest());

        List<Election> electionList = electionRepository.findAll();
        assertThat(electionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void checkInitDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = electionRepository.findAll().size();
        // set the field null
        election.setInitDate(null);

        // Create the Election, which fails.

        restElectionMockMvc.perform(post("/api/elections")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(election)))
            .andExpect(status().isBadRequest());

        List<Election> electionList = electionRepository.findAll();
        assertThat(electionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void checkEndDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = electionRepository.findAll().size();
        // set the field null
        election.setEndDate(null);

        // Create the Election, which fails.

        restElectionMockMvc.perform(post("/api/elections")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(election)))
            .andExpect(status().isBadRequest());

        List<Election> electionList = electionRepository.findAll();
        assertThat(electionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void getAllElections() throws Exception {
        // Initialize the database
        electionRepository.save(election);

        // Get all the electionList
        restElectionMockMvc.perform(get("/api/elections?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(election.getId())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].desc").value(hasItem(DEFAULT_DESC.toString())))
            .andExpect(jsonPath("$.[*].initDate").value(hasItem(sameInstant(DEFAULT_INIT_DATE))))
            .andExpect(jsonPath("$.[*].endDate").value(hasItem(sameInstant(DEFAULT_END_DATE))));
    }

    @Test
    public void getElection() throws Exception {
        // Initialize the database
        electionRepository.save(election);

        // Get the election
        restElectionMockMvc.perform(get("/api/elections/{id}", election.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(election.getId()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.desc").value(DEFAULT_DESC.toString()))
            .andExpect(jsonPath("$.initDate").value(sameInstant(DEFAULT_INIT_DATE)))
            .andExpect(jsonPath("$.endDate").value(sameInstant(DEFAULT_END_DATE)));
    }

    @Test
    public void getNonExistingElection() throws Exception {
        // Get the election
        restElectionMockMvc.perform(get("/api/elections/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    public void updateElection() throws Exception {
        // Initialize the database
        electionRepository.save(election);
        int databaseSizeBeforeUpdate = electionRepository.findAll().size();

        // Update the election
        Election updatedElection = electionRepository.findOne(election.getId());
        updatedElection.setName(UPDATED_NAME);
        updatedElection.setDesc(UPDATED_DESC);
        updatedElection.setInitDate(UPDATED_INIT_DATE);
        updatedElection.setEndDate(UPDATED_END_DATE);
        updatedElection.setCandList(UPDATED_CAND_LIST);
        updatedElection.init();

        restElectionMockMvc.perform(put("/api/elections")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedElection)))
            .andExpect(status().isOk());

        // Validate the Election in the database
        List<Election> electionList = electionRepository.findAll();
        assertThat(electionList).hasSize(databaseSizeBeforeUpdate);
        Election testElection = electionList.get(electionList.size() - 1);
        assertThat(testElection.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testElection.getDesc()).isEqualTo(UPDATED_DESC);
        assertThat(testElection.getInitDate()).isEqualTo(UPDATED_INIT_DATE);
        assertThat(testElection.getEndDate()).isEqualTo(UPDATED_END_DATE);
        assertThat(testElection.getCandList()).isEqualTo(UPDATED_CAND_LIST);

    }

    @Test
    public void updateNonExistingElection() throws Exception {
        int databaseSizeBeforeUpdate = electionRepository.findAll().size();

        // Create the Election

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restElectionMockMvc.perform(put("/api/elections")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(election)))
            .andExpect(status().isCreated());

        // Validate the Election in the database
        List<Election> electionList = electionRepository.findAll();
        assertThat(electionList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    public void deleteElection() throws Exception {
        // Initialize the database
        electionRepository.save(election);
        int databaseSizeBeforeDelete = electionRepository.findAll().size();

        // Get the election
        restElectionMockMvc.perform(delete("/api/elections/{id}", election.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Election> electionList = electionRepository.findAll();
        assertThat(electionList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Election.class);
    }
}
