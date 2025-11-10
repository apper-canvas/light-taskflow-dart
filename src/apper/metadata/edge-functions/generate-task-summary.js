import apper from 'https://cdn.apper.io/actions/apper-actions.js';

apper.serve(async (req) => {
  try {
    // Validate request method
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({
        success: false,
        message: 'Method not allowed. Use POST.'
      }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Parse request body
    let requestBody;
    try {
      requestBody = await req.json();
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Invalid JSON in request body'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate required fields
    const { title } = requestBody;
    
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Title is required and must be a non-empty string'
      }), {
        status: 422,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Generate summary based on title
    const cleanTitle = title.trim();
    
    // Create a brief, contextual summary
    let summary = '';
    
    // Analyze title for common task patterns
    if (cleanTitle.toLowerCase().includes('fix') || cleanTitle.toLowerCase().includes('bug')) {
      summary = `Resolve technical issue: ${cleanTitle}`;
    } else if (cleanTitle.toLowerCase().includes('implement') || cleanTitle.toLowerCase().includes('add')) {
      summary = `Development task: ${cleanTitle}`;
    } else if (cleanTitle.toLowerCase().includes('review') || cleanTitle.toLowerCase().includes('analyze')) {
      summary = `Analysis and review: ${cleanTitle}`;
    } else if (cleanTitle.toLowerCase().includes('update') || cleanTitle.toLowerCase().includes('modify')) {
      summary = `Update task: ${cleanTitle}`;
    } else if (cleanTitle.toLowerCase().includes('test') || cleanTitle.toLowerCase().includes('verify')) {
      summary = `Testing and validation: ${cleanTitle}`;
    } else if (cleanTitle.toLowerCase().includes('create') || cleanTitle.toLowerCase().includes('build')) {
      summary = `Creation task: ${cleanTitle}`;
    } else if (cleanTitle.toLowerCase().includes('deploy') || cleanTitle.toLowerCase().includes('release')) {
      summary = `Deployment task: ${cleanTitle}`;
    } else if (cleanTitle.toLowerCase().includes('meeting') || cleanTitle.toLowerCase().includes('discuss')) {
      summary = `Meeting and discussion: ${cleanTitle}`;
    } else if (cleanTitle.toLowerCase().includes('research') || cleanTitle.toLowerCase().includes('investigate')) {
      summary = `Research task: ${cleanTitle}`;
    } else if (cleanTitle.toLowerCase().includes('plan') || cleanTitle.toLowerCase().includes('design')) {
      summary = `Planning and design: ${cleanTitle}`;
    } else {
      // Generic summary for unmatched patterns
      const words = cleanTitle.split(' ');
      if (words.length > 8) {
        summary = `Task: ${words.slice(0, 8).join(' ')}...`;
      } else {
        summary = `Task: ${cleanTitle}`;
      }
    }

    // Ensure summary is not too long (database field limit consideration)
    if (summary.length > 150) {
      summary = summary.substring(0, 147) + '...';
    }

    // Return successful response with generated summary
    return new Response(JSON.stringify({
      success: true,
      data: {
        summary: summary,
        originalTitle: cleanTitle
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    // Handle unexpected errors
    return new Response(JSON.stringify({
      success: false,
      message: `Summary generation failed: ${error.message}`
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});