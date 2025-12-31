import React, { useState, useEffect, useRef } from 'react';

// アイテムカードコンポーネント
const ItemCard = ({ item }) => (
  <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
    <div className="flex items-center gap-3 mb-2">
      <div
        className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold"
        style={{ backgroundColor: item.color }}
      >
        #{item.id}
      </div>
      <div>
        <h3 className="font-semibold text-slate-900">{item.title}</h3>
        <p className="text-sm text-slate-500">{item.category}</p>
      </div>
    </div>
    <p className="text-slate-600 text-sm">{item.description}</p>
  </div>
);

// スピナー
const Spinner = () => (
  <div className="flex justify-center p-4">
    <svg
      className="animate-spin h-8 w-8 text-blue-600"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  </div>
);

// ダミーデータ生成
const generateItems = (page) => {
  const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];
  const categories = ['テクノロジー', 'デザイン', 'ビジネス', 'ライフスタイル', 'エンタメ'];

  return Array.from({ length: 10 }, (_, i) => {
    const id = page * 10 + i + 1;
    return {
      id,
      title: `アイテム ${id}`,
      category: categories[i % categories.length],
      description: `これは${id}番目のアイテムです。無限スクロールのデモ用のコンテンツです。`,
      color: colors[i % colors.length]
    };
  });
};

export default function App() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);

  // 初期データ読み込み
  useEffect(() => {
    loadMoreItems();
  }, []);

  // IntersectionObserver設定
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !isLoading && hasMore) {
          loadMoreItems();
        }
      },
      { rootMargin: '100px' } // 100px手前で発火
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [isLoading, hasMore]);

  // データ読み込み
  const loadMoreItems = async () => {
    if (isLoading) return;

    setIsLoading(true);

    // API呼び出しをシミュレート
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newItems = generateItems(page);
    setItems(prev => [...prev, ...newItems]);
    setPage(prev => prev + 1);

    // 5ページ目で終了（デモ用）
    if (page >= 4) {
      setHasMore(false);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center sticky top-0 bg-slate-50 py-4 z-10">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            無限スクロール デモ
          </h1>
          <p className="text-slate-600 mb-2">
            スクロールに合わせて自動的にコンテンツを追加読み込み
          </p>
          <p className="text-sm text-slate-500">
            読み込み済み: {items.length}件 / ページ: {page}
          </p>
        </div>

        {/* アイテムリスト */}
        <div className="space-y-3">
          {items.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>

        {/* ローダー（監視対象） */}
        <div ref={loaderRef} className="h-20 flex items-center justify-center">
          {isLoading && <Spinner />}
          {!hasMore && (
            <div className="text-slate-500 text-sm">
              すべてのアイテムを読み込みました
            </div>
          )}
        </div>

        {/* 説明 */}
        {items.length === 0 && !isLoading && (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="font-bold text-lg mb-2">仕組み</h2>
            <ol className="list-decimal list-inside space-y-2 text-slate-700">
              <li>リストの最下部に監視用の要素を配置</li>
              <li>IntersectionObserverでその要素が見えたら検知</li>
              <li>自動的に次のページのデータを読み込み</li>
              <li>rootMarginで少し手前から読み込み開始</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
