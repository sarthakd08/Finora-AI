export interface SaveConsultationData {
  id: string;
  userId: string;
  userEmail: string;
  title: string;
  category?: string;
  description?: string;
  goals?: string;
  date: string;
  duration: string;
  status: 'in-progress' | 'completed' | 'scheduled';
  agentName: string;
  summary: string;
}

/**
 * Save a new consultation via API route (bypasses RLS)
 */
export async function saveConsultation(data: SaveConsultationData) {
  try {
    console.log('💾 Saving consultation via API...');
    
    const response = await fetch('/api/consultations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      console.error('❌ API error:', result.error);
      throw new Error(result.error || 'Failed to save consultation');
    }

    console.log('✅ Consultation saved successfully:', result.data);
    return { success: true, data: result.data };
  } catch (error) {
    console.error('❌ Error in saveConsultation:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get all consultations for the current user via API route
 */
export async function getConsultations() {
  try {
    const response = await fetch('/api/consultations', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Failed to fetch consultations');
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error('Error in getConsultations:', error);
    return { success: false, error, data: [] };
  }
}

/**
 * Get a single consultation by ID via API route
 */
export async function getConsultationById(consultationId: string) {
  try {
    const response = await fetch(`/api/consultations/${consultationId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Failed to fetch consultation');
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error('Error in getConsultationById:', error);
    return { success: false, error, data: null };
  }
}

/**
 * Update consultation status via API route
 */
export async function updateConsultationStatus(
  consultationId: string,
  status: 'in-progress' | 'completed' | 'scheduled'
) {
  try {
    const response = await fetch(`/api/consultations/${consultationId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Failed to update consultation');
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error('Error in updateConsultationStatus:', error);
    return { success: false, error, data: null };
  }
}

/**
 * Update consultation duration via API route
 */
export async function updateConsultationDuration(
  consultationId: string,
  duration: string
) {
  try {
    const response = await fetch(`/api/consultations/${consultationId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ duration }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Failed to update consultation');
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error('Error in updateConsultationDuration:', error);
    return { success: false, error, data: null };
  }
}
