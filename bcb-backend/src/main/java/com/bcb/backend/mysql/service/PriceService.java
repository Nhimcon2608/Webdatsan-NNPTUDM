package com.bcb.backend.mysql.service;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.bcb.backend.mysql.dto.request.PriceRequest;
import com.bcb.backend.mysql.dto.response.BranchPricesResponse;
import com.bcb.backend.mysql.dto.response.PriceResponse;
import com.bcb.backend.mysql.mapper.PriceMapper;
import com.bcb.backend.mysql.model.Branch;
import com.bcb.backend.mysql.model.Price;
import com.bcb.backend.mysql.model.PriceType;
import com.bcb.backend.mysql.repository.BranchRepository;
import com.bcb.backend.mysql.repository.PriceRepository;
import com.bcb.backend.mysql.repository.PriceTypeRepository;

@Service
public class PriceService {

	private final PriceRepository priceRepo;
	private final BranchRepository branchRepo;
	private final PriceTypeRepository priceTypeRepo;

	public PriceService(PriceRepository priceRepository, BranchRepository branchRepo,
			PriceTypeRepository priceTypeRepo) {
		this.priceRepo = priceRepository;
		this.branchRepo = branchRepo;
		this.priceTypeRepo = priceTypeRepo;
	}

	public List<PriceResponse> getPricesByBranchId(String branchId) {
		return priceRepo.findByBranchId(branchId).stream()
				.map(PriceMapper::toDTO)
				.collect(Collectors.toList());
	}

	public List<PriceResponse> getPricesByBranchAndPriceType(String branchId, String priceTypeId) {

		if (!branchRepo.existsById(branchId)) {
			throw new IllegalArgumentException("Branch not found with id: " + branchId);
		}

		if (!priceTypeRepo.existsById(priceTypeId)) {
			throw new IllegalArgumentException("PriceType not found with id: " + priceTypeId);
		}

		return priceRepo.findByBranchIdAndPriceTypeId(branchId, priceTypeId).stream()
				.map(PriceMapper::toDTO)
				.collect(Collectors.toList());
	}

	public BranchPricesResponse getAllPriceTypesByBranch(String branchId) {

		Branch branch = branchRepo.findById(branchId)
				.orElseThrow(() -> new IllegalArgumentException("Branch not found with id: " + branchId));

		List<Price> allPrices = priceRepo.findByBranchId(branchId);

		List<PriceResponse> fixedPrices = allPrices.stream()
				.filter(price -> price.getPriceType() != null &&
						"Cố định".equals(price.getPriceType().getType()))
				.map(PriceMapper::toDTO)
				.collect(Collectors.toList());

		List<PriceResponse> casualPrices = allPrices.stream()
				.filter(price -> price.getPriceType() != null &&
						"Vãng lai".equals(price.getPriceType().getType()))
				.map(PriceMapper::toDTO)
				.collect(Collectors.toList());

		return BranchPricesResponse.builder()
				.branchId(branch.getId())
				.branchName(branch.getBranchName())
				.fixedPrices(fixedPrices)
				.casualPrices(casualPrices)
				.build();
	}

	public PriceResponse getPriceById(String id) {
		return priceRepo.findById(id)
				.map(PriceMapper::toDTO)
				.orElseThrow(() -> new IllegalArgumentException(
						"Price not found with id: " + id));
	}

	public PriceResponse createPrice(PriceRequest priceRequest) {

		if (!checkTime(priceRequest.getStartTime(), priceRequest.getEndTime())) {
			throw new RuntimeException("Invalid time");
		}

		PriceType priceType = null;
		if (priceRequest.getPriceTypeId() != null) {
			priceType = priceTypeRepo.findById(priceRequest.getPriceTypeId())
					.orElseThrow(() -> new IllegalArgumentException(
							"PriceType not found with id: " + priceRequest.getPriceTypeId()));
		}

		Price price = Price.builder()
				.id(GenerationId.generateId("pric"))
				.startTime(priceRequest.getStartTime())
				.endTime(priceRequest.getEndTime())
				.dayOfWeek(priceRequest.getDayOfWeek()) // 🆕
				.pricePerHour(priceRequest.getPricePerHour())
				.priceType(priceType) // 🆕
				.build();

		price.setBranch(branchRepo.findById(priceRequest.getBranchId())
				.orElseThrow(() -> new IllegalArgumentException(
						"Branch not found with id " + priceRequest.getBranchId())));

		return PriceMapper.toDTO(priceRepo.save(price));
	}

	public PriceResponse updatePrice(String id, PriceRequest priceRequest) {

		if (!checkTime(priceRequest.getStartTime(), priceRequest.getEndTime())) {
			throw new RuntimeException("Invalid time");
		}

		Price price = priceRepo.findById(id)
				.orElseThrow(() -> new IllegalArgumentException(
						"Price not found with id: " + id));

		price.setStartTime(priceRequest.getStartTime());
		price.setEndTime(priceRequest.getEndTime());
		price.setDayOfWeek(priceRequest.getDayOfWeek()); // 🆕
		price.setPricePerHour(priceRequest.getPricePerHour());

		if (priceRequest.getPriceTypeId() != null) {
			PriceType priceType = priceTypeRepo.findById(priceRequest.getPriceTypeId())
					.orElseThrow(() -> new IllegalArgumentException(
							"PriceType not found with id: " + priceRequest.getPriceTypeId()));
			price.setPriceType(priceType);
		}

		return PriceMapper.toDTO(priceRepo.save(price));
	}

	public boolean deletePrice(String id) {
		try {
			Price price = priceRepo.findById(id)
					.orElseThrow(() -> new IllegalArgumentException(
							"Price not found with id: " + id));
			priceRepo.delete(price);
			priceRepo.flush();
			return true;
		} catch (Exception e) {
			throw e;
		}
	}

	public BigDecimal prepareTheBill(LocalTime start, double rentalTime, String branchId) {

		List<PriceResponse> prices = priceRepo.findAll().stream()
				.filter(price -> branchId.equals(price.getBranch().getId()))
				.map(PriceMapper::toDTO)
				.collect(Collectors.toList());

		short startTime = (short) start.getHour();

		BigDecimal total = BigDecimal.ZERO;

		for (short i = startTime; i < startTime + rentalTime; i++) {
			for (PriceResponse p : prices) {
				if (i >= p.getStartTime() && i <= p.getEndTime()) {
					total = total.add(p.getPricePerHour());
				}
			}
		}

		return total;
	}

	public boolean checkTime(short startTime, short endTime) {
		if (startTime >= endTime) {
			return false;
		}
		if (startTime < 0 || endTime > 23) {
			return false;
		}
		return true;
	}
}