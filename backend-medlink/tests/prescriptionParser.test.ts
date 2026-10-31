jest.mock('../src/modules/intelligence/ocr/identification.service', () => ({
  identifyFromText: jest.fn().mockResolvedValue([]),
}));

import { parsePrescriptionText } from '../src/modules/intelligence/prescriptions/prescription.parser';

describe('prescription parser', () => {
  it('extracts medicine, strength, slot dosing and duration', async () => {
    const result = await parsePrescriptionText('Tab Paracetamol 500mg 1-0-1 x 5 days after food');
    expect(result.items).toHaveLength(1);

    const [item] = result.items;
    expect(item.medicineName.toLowerCase()).toContain('paracetamol');
    expect(item.dosage).toBe('500mg');
    expect(item.timings).toEqual(['08:00', '20:00']);
    expect(item.durationDays).toBe(5);
    expect(item.instructions).toMatch(/after food/i);
  });

  it('maps shorthand frequencies to dose times', async () => {
    const result = await parsePrescriptionText('Cap Amoxicillin 500mg TDS for 1 week');
    const [item] = result.items;
    expect(item.timings).toHaveLength(3);
    expect(item.durationDays).toBe(7);
  });

  it('never reports parsed output as verified', async () => {
    const result = await parsePrescriptionText('Tab Metformin 500mg BD');
    expect(result.verified).toBe(false);
    expect(result.items.every((i) => i.confidence < 1)).toBe(true);
  });

  it('keeps header lines out of the medicine list', async () => {
    const result = await parsePrescriptionText(
      ['Dr. A. Sharma, MBBS', 'Patient: Ram Kumar  Age: 54', 'Tab Paracetamol 500mg BD'].join('\n'),
    );
    expect(result.items).toHaveLength(1);
    expect(result.unparsedLines.length).toBeGreaterThan(0);
  });
});
