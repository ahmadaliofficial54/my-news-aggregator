'use client';

import React from 'react';
// Optional icon from react-icons
import { FiExternalLink } from 'react-icons/fi';

interface Article {
  title: string;
  url: string;
  source: string;
  publishedAt: string;
  author?: string;
  // If you have an image in your data, you can add:
  // imageUrl?: string;
}

export default function ArticleCard({ article }: { article: Article }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
      {/* Optional Thumbnail */}
      {/*
        <img
          src={article.imageUrl || '/placeholder.jpg'}
          alt={article.title}
          className="h-48 w-full object-cover"
        />
      */}

      {/* Header with optional gradient */}
      <div className="bg-gradient-to-r from-blue-50 to-white p-4">
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <h2 className="mb-2 text-xl font-semibold leading-snug text-gray-800 line-clamp-2 hover:text-blue-600">
            {article.title}
          </h2>
        </a>
        {/* Source badge */}
        <span className="inline-block rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
          {article.source || 'Unknown Source'}
        </span>
      </div>

      {/* Body / Metadata */}
      <div className="flex flex-1 flex-col justify-between p-4 text-sm text-gray-600">
        {/* Author & Date */}
        <div className="mb-3 space-y-1">
          {article.author && (
            <p>
              <span className="font-medium text-gray-700">Author:</span>{' '}
              {article.author}
            </p>
          )}
          <p>
            <span className="font-medium text-gray-700">Published:</span>{' '}
            {new Date(article.publishedAt).toLocaleString()}
          </p>
        </div>

        {/* CTA / Footer */}
        <div>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Read More
            <FiExternalLink className="ml-2 h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}