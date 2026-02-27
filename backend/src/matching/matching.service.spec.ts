import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MatchingService } from './matching.service';
import { Mission } from '../missions/entities/mission.entity';
import { Offer } from '../offers/entities/offer.entity';
import { Correlation } from '../correlations/entities/correlation.entity';
import {
  MissionStatus,
  OfferStatus,
  MissionCategory,
  HelpType,
  OfferType,
  Urgency,
} from '../shared/enums';

describe('MatchingService', () => {
  let service: MatchingService;
  let missionsRepository: Repository<Mission>;
  let offersRepository: Repository<Offer>;
  let correlationsRepository: Repository<Correlation>;

  const mockMissionsRepository = {
    findOneBy: jest.fn(),
    find: jest.fn(),
  };

  const mockOffersRepository = {
    find: jest.fn(),
  };

  const mockCorrelationsRepository = {
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchingService,
        {
          provide: getRepositoryToken(Mission),
          useValue: mockMissionsRepository,
        },
        {
          provide: getRepositoryToken(Offer),
          useValue: mockOffersRepository,
        },
        {
          provide: getRepositoryToken(Correlation),
          useValue: mockCorrelationsRepository,
        },
      ],
    }).compile();

    service = module.get<MatchingService>(MatchingService);
    missionsRepository = module.get(getRepositoryToken(Mission));
    offersRepository = module.get(getRepositoryToken(Offer));
    correlationsRepository = module.get(getRepositoryToken(Correlation));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('computeScore (V2 - private method testing via correlate)', () => {
    const baseMission: Partial<Mission> = {
      id: 'mission-1',
      title: 'Test Mission',
      status: MissionStatus.OUVERTE,
      category: MissionCategory.DEMENAGEMENT,
      helpType: HelpType.MATERIEL,
      urgency: Urgency.MOYEN,
      tags: ['demenagement', 'transport'],
      expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
      locationLat: 48.8566,
      locationLng: 2.3522,
      locationRadiusKm: 10,
    };

    const baseOffer: Partial<Offer> = {
      id: 'offer-1',
      title: 'Test Offer',
      status: OfferStatus.OUVERTE,
      category: MissionCategory.DEMENAGEMENT,
      offerType: OfferType.MATERIEL,
      tags: ['demenagement'],
      locationLat: 48.8566,
      locationLng: 2.3522,
      locationRadiusKm: 10,
    };

    it('should compute base score with all factors matching', async () => {
      mockMissionsRepository.findOneBy.mockResolvedValue(baseMission);
      mockOffersRepository.find.mockResolvedValue([baseOffer]);
      mockCorrelationsRepository.findOneBy.mockResolvedValue(null);
      mockCorrelationsRepository.create.mockImplementation((dto) => dto);
      mockCorrelationsRepository.save.mockImplementation((entity) => ({
        id: 'corr-1',
        ...entity,
      }));

      const result = await service.correlateMission('mission-1');

      expect(result.length).toBe(1);
      // Score breakdown:
      // - Tag overlap: 12.5 (50% match = 25 * 0.5)
      // - Category: 20
      // - Help type: 20
      // - Location: 20 (same location)
      // - Urgency: 5 (moyen)
      // - Timing: 3 (14 days left)
      // Total: ~80.5
      expect(result[0].score).toBeGreaterThan(70);
      expect(result[0].score).toBeLessThan(90);
    });

    it('should give urgency bonus to urgent missions', async () => {
      const urgentMission = {
        ...baseMission,
        urgency: Urgency.URGENT,
      };

      mockMissionsRepository.findOneBy.mockResolvedValue(urgentMission);
      mockOffersRepository.find.mockResolvedValue([baseOffer]);
      mockCorrelationsRepository.findOneBy.mockResolvedValue(null);
      mockCorrelationsRepository.create.mockImplementation((dto) => dto);
      mockCorrelationsRepository.save.mockImplementation((entity) => ({
        id: 'corr-1',
        ...entity,
      }));

      const result = await service.correlateMission('mission-1');

      // Urgent should add 10 points instead of 5
      expect(result[0].score).toBeGreaterThan(75);
    });

    it('should give timing bonus to missions expiring soon', async () => {
      const soonMission = {
        ...baseMission,
        expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
      };

      mockMissionsRepository.findOneBy.mockResolvedValue(soonMission);
      mockOffersRepository.find.mockResolvedValue([baseOffer]);
      mockCorrelationsRepository.findOneBy.mockResolvedValue(null);
      mockCorrelationsRepository.create.mockImplementation((dto) => dto);
      mockCorrelationsRepository.save.mockImplementation((entity) => ({
        id: 'corr-1',
        ...entity,
      }));

      const result = await service.correlateMission('mission-1');

      // Expiring within 7 days = +5 timing bonus
      expect(result[0].score).toBeGreaterThan(70);
    });

    it('should not match if score < 10', async () => {
      const lowScoreMission = {
        ...baseMission,
        category: MissionCategory.NUMERIQUE, // Different category
        helpType: HelpType.CONSEIL, // Different help type
        tags: [], // No tags
        locationLat: null, // No location
        locationLng: null,
        urgency: Urgency.FAIBLE, // No urgency bonus
        expiresAt: null, // No timing bonus
      };

      const lowScoreOffer = {
        ...baseOffer,
        category: MissionCategory.DEMENAGEMENT,
        tags: [],
      };

      mockMissionsRepository.findOneBy.mockResolvedValue(lowScoreMission);
      mockOffersRepository.find.mockResolvedValue([lowScoreOffer]);
      mockCorrelationsRepository.findOneBy.mockResolvedValue(null);

      const result = await service.correlateMission('mission-1');

      // No matches because score too low
      expect(result.length).toBe(0);
    });

    it('should handle geographic distance correctly', async () => {
      const farMission = {
        ...baseMission,
        locationLat: 45.764043, // Lyon
        locationLng: 4.835659,
      };

      mockMissionsRepository.findOneBy.mockResolvedValue(farMission);
      mockOffersRepository.find.mockResolvedValue([baseOffer]); // Paris
      mockCorrelationsRepository.findOneBy.mockResolvedValue(null);
      mockCorrelationsRepository.create.mockImplementation((dto) => dto);
      mockCorrelationsRepository.save.mockImplementation((entity) => ({
        id: 'corr-1',
        ...entity,
      }));

      const result = await service.correlateMission('mission-1');

      // Distance Paris-Lyon > radius → no location score
      // But still matches on other factors
      expect(result.length).toBe(1);
      expect(result[0].score).toBeLessThan(70); // Missing location points
    });
  });

  describe('getSuggestionsForUser', () => {
    it('should return empty if user has no offers', async () => {
      mockOffersRepository.find.mockResolvedValue([]);

      const result = await service.getSuggestionsForUser('user-1');

      expect(result).toEqual([]);
    });

    it('should not suggest user own missions', async () => {
      const userOffer = {
        id: 'offer-1',
        creatorId: 'user-1',
        status: OfferStatus.OUVERTE,
        category: MissionCategory.DEMENAGEMENT,
        offerType: OfferType.MATERIEL,
        tags: ['test'],
      };

      const userMission = {
        id: 'mission-1',
        creatorId: 'user-1', // Same user
        status: MissionStatus.OUVERTE,
        category: MissionCategory.DEMENAGEMENT,
        helpType: HelpType.MATERIEL,
        urgency: Urgency.MOYEN,
        tags: ['test'],
      };

      mockOffersRepository.find.mockResolvedValue([userOffer]);
      mockMissionsRepository.find.mockResolvedValue([userMission]);

      const result = await service.getSuggestionsForUser('user-1');

      // Should not suggest user's own mission
      expect(result).toEqual([]);
    });

    it('should return top 20 suggestions sorted by score', async () => {
      const userOffer = {
        id: 'offer-1',
        creatorId: 'user-1',
        status: OfferStatus.OUVERTE,
        category: MissionCategory.DEMENAGEMENT,
        offerType: OfferType.MATERIEL,
        tags: ['demenagement'],
      };

      // Create 25 missions with varying scores
      const missions = Array.from({ length: 25 }, (_, i) => ({
        id: `mission-${i}`,
        creatorId: 'user-2',
        status: MissionStatus.OUVERTE,
        category: i < 10 ? MissionCategory.DEMENAGEMENT : MissionCategory.NUMERIQUE,
        helpType: i < 10 ? HelpType.MATERIEL : HelpType.CONSEIL,
        urgency: i < 5 ? Urgency.URGENT : Urgency.FAIBLE,
        tags: i < 10 ? ['demenagement'] : ['autre'],
      }));

      mockOffersRepository.find.mockResolvedValue([userOffer]);
      mockMissionsRepository.find.mockResolvedValue(missions);

      const result = await service.getSuggestionsForUser('user-1');

      // Should return max 20 suggestions
      expect(result.length).toBeLessThanOrEqual(20);

      // Should be sorted by score (descending)
      for (let i = 1; i < result.length; i++) {
        expect(result[i - 1].score).toBeGreaterThanOrEqual(result[i].score);
      }

      // First results should be high-scoring matches
      expect(result[0].score).toBeGreaterThan(30);
    });
  });
});
