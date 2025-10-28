import axios from 'axios';

const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';

/**
 * Busca livros na Google Books API
 * @param {string} query - título, autor ou ISBN do livro
 * @param {number} maxResults - número máximo de resultados (padrão: 10)
 * @returns {Promise} - Promise com os resultados
 */
export async function buscarLivros(query, maxResults = 10) {
    try {
        const response = await axios.get(GOOGLE_BOOKS_API, {
            params: {
                q: query,
                maxResults: maxResults,
                langRestrict: 'pt', // Priorizar livros em português
                printType: 'books'  // Apenas livros (não revistas)
            }
        });

        if (!response.data.items || response.data.items.length === 0) {
            return null;
        }

        // Formatar os resultados
        const livros = response.data.items.map(item => {
            const volumeInfo = item.volumeInfo;
            
            return {
                id: item.id,
                titulo: volumeInfo.title || 'Título não disponível',
                autores: volumeInfo.authors || ['Autor desconhecido'],
                descricao: volumeInfo.description || 'Sem descrição',
                capa: volumeInfo.imageLinks?.thumbnail || null,
                anoPublicacao: volumeInfo.publishedDate || 'Desconhecido',
                editora: volumeInfo.publisher || 'Editora desconhecida',
                paginas: volumeInfo.pageCount || 0,
                categorias: volumeInfo.categories || [],
                isbn: volumeInfo.industryIdentifiers?.[0]?.identifier || null,
                idioma: volumeInfo.language || 'Desconhecido',
                previewLink: volumeInfo.previewLink || null
            };
        });

        return livros;

    } catch (error) {
        console.error('Erro ao buscar livros na Google Books API:', error.message);
        throw new Error('Erro ao buscar livros');
    }
}

/**
 * Busca um livro específico por ID
 * @param {string} bookId - ID do livro na Google Books
 * @returns {Promise} - Promise com os dados do livro
 */
export async function buscarLivroPorId(bookId) {
    try {
        const response = await axios.get(`${GOOGLE_BOOKS_API}/${bookId}`);

        const volumeInfo = response.data.volumeInfo;

        return {
            id: response.data.id,
            titulo: volumeInfo.title,
            autores: volumeInfo.authors || [],
            descricao: volumeInfo.description || '',
            capa: volumeInfo.imageLinks?.thumbnail || null,
            anoPublicacao: volumeInfo.publishedDate || '',
            editora: volumeInfo.publisher || '',
            paginas: volumeInfo.pageCount || 0,
            categorias: volumeInfo.categories || [],
            isbn: volumeInfo.industryIdentifiers?.[0]?.identifier || null,
            idioma: volumeInfo.language,
            previewLink: volumeInfo.previewLink || null
        };

    } catch (error) {
        console.error('Erro ao buscar livro por ID:', error.message);
        throw new Error('Livro não encontrado');
    }
}

/**
 * Busca livros por ISBN
 * @param {string} isbn - ISBN do livro
 * @returns {Promise} - Promise com os dados do livro
 */
export async function buscarLivroPorISBN(isbn) {
    try {
        const response = await axios.get(GOOGLE_BOOKS_API, {
            params: {
                q: `isbn:${isbn}`
            }
        });

        if (!response.data.items || response.data.items.length === 0) {
            return null;
        }

        const item = response.data.items[0];
        const volumeInfo = item.volumeInfo;

        return {
            id: item.id,
            titulo: volumeInfo.title,
            autores: volumeInfo.authors || [],
            descricao: volumeInfo.description || '',
            capa: volumeInfo.imageLinks?.thumbnail || null,
            anoPublicacao: volumeInfo.publishedDate || '',
            editora: volumeInfo.publisher || '',
            paginas: volumeInfo.pageCount || 0,
            categorias: volumeInfo.categories || [],
            isbn: volumeInfo.industryIdentifiers?.[0]?.identifier || null,
            idioma: volumeInfo.language,
            previewLink: volumeInfo.previewLink || null
        };

    } catch (error) {
        console.error('Erro ao buscar livro por ISBN:', error.message);
        throw new Error('Livro não encontrado');
    }
}