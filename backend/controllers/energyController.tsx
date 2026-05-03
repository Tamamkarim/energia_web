import { Request, Response } from "express";
import pool from "../database";

export const addEnergyRecord = async (req: Request, res: Response) => {
	try {
		const { consumption, date, notes, category } = req.body;
		const userId = req.user.id;

		if (!consumption || !date) {
			return res.status(400).json({
				message: "Consumption and date are required",
			});
		}

		await pool.query(
			"INSERT INTO energy_records (user_id, consumption, date, notes, category) VALUES (?, ?, ?, ?, ?)",
			[userId, consumption, date, notes || null, category || "electricity"]
		);

		res.status(201).json({
			message: "Energy record added successfully",
		});
	} catch (error: any) {
		res.status(500).json({
			message: "Failed to add energy record",
			error: error.message,
		});
	}
};

export const getEnergyRecords = async (req: Request, res: Response) => {
	try {
		const userId = req.user.id;
		const [records] = await pool.query(
			"SELECT * FROM energy_records WHERE user_id = ? ORDER BY date DESC",
			[userId]
		);

		res.json(records);
	} catch (error: any) {
		res.status(500).json({
			message: "Failed to get energy records",
			error: error.message,
		});
	}
};

export const updateEnergyRecord = async (req: Request, res: Response) => {
	try {
		const userId = req.user.id;
		const recordId = req.params.id;
		const { consumption, date, notes, category } = req.body;

		if (!consumption || !date) {
			return res.status(400).json({
				message: "Consumption and date are required",
			});
		}

		const [result]: any = await pool.query(
			"UPDATE energy_records SET consumption = ?, date = ?, notes = ?, category = ? WHERE id = ? AND user_id = ?",
			[consumption, date, notes || null, category || "electricity", recordId, userId]
		);

		if (result.affectedRows === 0) {
			return res.status(404).json({
				message: "Energy record not found",
			});
		}

		res.json({
			message: "Energy record updated successfully",
		});
	} catch (error: any) {
		res.status(500).json({
			message: "Failed to update energy record",
			error: error.message,
		});
	}
};

export const deleteEnergyRecord = async (req: Request, res: Response) => {
	try {
		const userId = req.user.id;
		const recordId = req.params.id;

		const [result]: any = await pool.query(
			"DELETE FROM energy_records WHERE id = ? AND user_id = ?",
			[recordId, userId]
		);

		if (result.affectedRows === 0) {
			return res.status(404).json({
				message: "Energy record not found",
			});
		}

		res.json({
			message: "Energy record deleted successfully",
		});
	} catch (error: any) {
		res.status(500).json({
			message: "Failed to delete energy record",
			error: error.message,
		});
	}
};
